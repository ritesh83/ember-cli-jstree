/*jshint loopfunc: true */

import Ember from 'ember';
import ActionProxy from 'ember-component-inbound-actions/action-proxy';

export default Ember.Component.extend({
    actionReceiver: null,
    data: null,
    plugins: null,
    themes: null,
    checkboxOptions: null,
    contextmenuOptions: null,
    typesOptions: null,
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

        var typesOptions = this.get('typesOptions');
        if(typesOptions && pluginsArray.indexOf("types") !== -1) {
            configObject["types"] = typesOptions;
        }

        var contextmenuOptions = this.get('contextmenuOptions');
        if (contextmenuOptions && pluginsArray.indexOf("contextmenu") !== -1) {
            // Remap action names to functions
            if (undefined !== contextmenuOptions["items"]) {
                for (var menuItem in contextmenuOptions["items"]) {
                    if (contextmenuOptions["items"].hasOwnProperty(menuItem)) {
                        // Only change it if it's a string. If a function, leave it
                        if (typeof contextmenuOptions["items"][menuItem]["action"] === "string") {
                            var emberAction = contextmenuOptions["items"][menuItem]["action"];
                            contextmenuOptions["items"][menuItem]["action"] = function() {
                                Ember.run(self, function() {
                                    this.send("contextmenuItemDidClick", emberAction);
                                });
                            };
                        }
                    }
                }
            }
            configObject["contextmenu"] = contextmenuOptions;
        }

        var treeObject = this.$().jstree(configObject);
        treeObject.on('changed.jstree', function (e, data) {
            this.sendAction("selectionDidChange", data.node);
        }.bind(this));
        treeObject.on('ready.jstree', function() {
            this.sendAction("treeDidBecomeReady");
        }.bind(this));

        var proxy = ActionProxy.create({
            target: this
        });

        this.set('actionReceiver', proxy);
        this.set('treeObject', treeObject);
    },

    _refresh: function() {
        var o = this.get('treeObject');
        if (null !== o) {
            o.jstree({
                'core': {
                    'data': this.get('data')
                }
            });
        }
    },

    willDestroyElement: function() {

    },

    actions: {
        redraw: function() {
            var o = this.get('treeObject');
            if (null !== o) {
                this._refresh();
                o.jstree().redraw(true);
            }
        },

        destroy: function() {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree().destroy();
            }
        },

        contextmenuItemDidClick: function(actionName) {
            if (undefined !== actionName) {
                this.sendAction(actionName);
            }
        }
    }
    
});
