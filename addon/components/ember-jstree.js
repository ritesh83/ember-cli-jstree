/*jshint loopfunc: true */

import Ember from 'ember';
import InboundActions from 'ember-component-inbound-actions/inbound-actions';

export default Ember.Component.extend(InboundActions, {
    actionReceiver: null,
    currentNode: null,
    data: null,
    plugins: null,
    themes: null,
    checkboxOptions: null,
    contextmenuOptions: null,
    typesOptions: null,
    selectedNodes: null,
    selectionDidChange: null,
    treeObject: null,

    didInsertElement: function() {
        var configObject = {};
        var self = this;

        configObject["core"] = {
            "data": this.get('data'),
            "check_callback": true
        };

        var themes = this.get('themes');
        if (themes && typeof themes === "object") {
            configObject["core"]["themes"] = themes;
        }

        var pluginsArray = this.get('plugins').replace(/ /g, '').split(',');
        configObject["plugins"] = pluginsArray;

        if (pluginsArray.indexOf("contextmenu") !== -1 ||
            pluginsArray.indexOf("dnd") !== -1 ||
            pluginsArray.indexOf("unique") !== -1) {
            // These plugins need core.check_callback
            configObject["core"]["check_callback"] = true;
        }

        var checkboxOptions = this.get('checkboxOptions');
        if(checkboxOptions && pluginsArray.indexOf("checkbox") !== -1) {
            configObject["checkbox"] = checkboxOptions;
        }

        var stateOptions = this.get('stateOptions');
        if(stateOptions && pluginsArray.indexOf("state") !== -1) {
            configObject["checkbox"] = stateOptions;
        }

        var typesOptions = this.get('typesOptions');
        if(typesOptions && pluginsArray.indexOf("types") !== -1) {
            configObject["types"] = typesOptions;
        }

        var contextmenuOptions = this.get('contextmenuOptions');

        /*
         * This has eventually got to go. It's terrible.
         */
        if (contextmenuOptions && pluginsArray.indexOf("contextmenu") !== -1) {
            // Remap action hash to functions and don't forget to pass node through
            if (typeof contextmenuOptions["items"] === "object") {
                var newMenuItems = {};
                for (var menuItem in contextmenuOptions["items"]) {
                    if (contextmenuOptions["items"].hasOwnProperty(menuItem)) {
                        // Copy over everything first
                        newMenuItems[menuItem] = contextmenuOptions["items"][menuItem];

                        // Only change it if it's a string. If a function, leave it
                        // This needs to be done so Ember can hijack the action and call it instead
                        if (typeof contextmenuOptions["items"][menuItem]["action"] === "string") {
                            var emberAction = contextmenuOptions["items"][menuItem]["action"];
                            newMenuItems[menuItem]["action"] = function() {
                                Ember.run(self, function() {
                                    var node = this.get('currentNode');
                                    this.send("contextmenuItemDidClick", emberAction, node);
                                });
                            };
                        }
                    }
                }

                // Wrap it up
                contextmenuOptions["items"] = function(node) {
                    Ember.run(self, function() {
                        this.set('currentNode', node);
                    });
                    return newMenuItems;
                };


            }
            
            // Pass options into the config object
            configObject["contextmenu"] = contextmenuOptions;
        }

        var treeObject = this.$().jstree(configObject);
        treeObject.on('changed.jstree', function (e, data) {
            this.sendAction("jstreeDidChange", data);

            // Check if selection changed
            var selectionChangedEventNames = ["model", "select_node", "deselect_node", "select_all", "deselect_all"];
            if (data.action && selectionChangedEventNames.indexOf(data.action) !== -1) {
                var selNodes = Ember.A(this.get('treeObject').jstree(true).get_selected(true));
                this.set("selectedNodes", selNodes);
            }

        }.bind(this));
        treeObject.on('ready.jstree', function() {
            this.sendAction("jstreeDidBecomeReady");
        }.bind(this));

        this.set('treeObject', treeObject);
    },

    willDestroyElement: function() {

    },

    getTree: function() {
        var o = this.get('treeObject');
        return o.jstree(true);
    },

    actions: {

        redraw: function() {
            var o = this.get('treeObject');
            var t = o.jstree(true);
            if (null !== t) {
                t.settings.core['data'] = this.get('data');
                t.refresh();
            }
        },

        destroy: function() {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).destroy();
            }
        },

        contextmenuItemDidClick: function(actionName, node) {
            var tree = this.get('getTree');
            if (undefined !== actionName) {
                this.sendAction(actionName, node, tree);
            }
        }
    }
    
});
