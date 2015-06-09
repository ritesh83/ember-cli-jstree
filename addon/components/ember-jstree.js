/*jshint loopfunc: true */

import Ember from 'ember';
import InboundActions from 'ember-component-inbound-actions/inbound-actions';
import EmberJstreeActions from 'ember-cli-jstree/mixins/ember-jstree-actions';

export default Ember.Component.extend(InboundActions, EmberJstreeActions, {
    // Properties for Ember communication
    actionReceiver:       null,
    currentNode:          null,
    selectedNodes:        null,

    // Basic configuration objects
    data:                 null,
    plugins:              null,
    themes:               null,
    checkCallback:        true,

    // Plugin option objects
    checkboxOptions:      null,
    contextmenuOptions:   null,
    typesOptions:         null,

    selectionDidChange:   null,
    treeObject:           null,

    // Internals
    _isDestroying:        false,

    isReady:              false,
    _isReadyTestWaiter: function() {
        return this.get('isReady') === true;
    },

    didInsertElement: function() {
        var applicationConfig = this.container.lookupFactory('config:environment');
        if(applicationConfig.environment === "test") {
            // Add test waiter.
            Ember.Test.registerWaiter(this, this._isReadyTestWaiter);
        }

        var treeObject = this._setupJsTree();

        this._setupEventHandlers(treeObject);

        this.set('treeObject', treeObject);
    },

    willDestroyElement: function() {
        var applicationConfig = this.container.lookupFactory('config:environment');
        if(applicationConfig.environment === "test") {
            Ember.Test.unregisterWaiter(this, this._isReadyTestWaiter);
        }

        this.set('isReady', false);
        this.set('_isDestroying', true);
        this.send('destroy');
    },

    searchCallback: function(str, node) {
        if(typeof node.original === 'object') {
            if(node.original[this.search_property]) {
               var propValue = node.original[this.search_property];
               if(propValue === str) {
                  return true;
               }
            }
        }

        return false;
    },

    /**
    * Main setup function that registers all the plugins and sets up the core
    * configuration object for jsTree
    *
    * @method _setupJsTree
    */
    _setupJsTree: function() {
        var configObject = {};

        configObject["core"] = {
            "data": this.get('data'),
            "check_callback": this.get('checkCallback')
        };

        var themes = this.get('themes');
        if (themes && typeof themes === "object") {
            configObject["core"]["themes"] = themes;
        }

        var pluginsArray = this.get('plugins');
        if(pluginsArray) {
            pluginsArray = pluginsArray.replace(/ /g, '').split(',');
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

            configObject["contextmenu"] = this._setupContextMenus(pluginsArray);

            configObject["search"] = {"search_callback" : this.searchCallback.bind(this)};
        }

        return this.$().jstree(configObject);
    },

    /**
     * We essentially need to hijack the jstree contextmenu plugin in order for us
     * to do messaging between this Ember addon/component and jstree
     *
     * @method _setupContextMenus
     * @param  {Array} pluginsArray Array of plugins to be used
     * @return {Array} An Array of Ember-friendly options to pass back into the config object
     */
    _setupContextMenus: function(pluginsArray) {
        var contextmenuOptions = this.get('contextmenuOptions');

        if (null === pluginsArray) {
            return;
        }

        // This has eventually got to go. It's terrible.
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
                                Ember.run(this, function() {
                                    var node = this.get('currentNode');
                                    this.send("contextmenuItemDidClick", emberAction, node);
                                });
                            }.bind(this);
                        }
                    }
                }

                // Wrap it up
                contextmenuOptions["items"] = function(node) {
                    Ember.run(this, function() {
                        this.set('currentNode', node);
                    });
                    return newMenuItems;
                }.bind(this);


            }

            // Pass options back into the config object
            return contextmenuOptions;
        }
    },

    /**
     * Register all sorts of events
     * TODO: This should eventually encompass all of the jsTree events declared in their API.
     *
     * @method _setupEventHandlers
     * @param  {Object}
     * @return
     */
    _setupEventHandlers: function(treeObject) {

        if (typeof treeObject !== 'object') {
            throw new Error('You must pass a valid jsTree object to set up its event handlers');
        }

        /*
          Event: init.jstree
          Action: eventDidInit
          triggered after all events are bound
        */
        treeObject.on('init.jstree', function() {
            Ember.run(this, function() {
                this.sendAction('eventDidInit');
            });
        }.bind(this));

        /*
          Event: ready.jstree
          Action: eventDidBecomeReady
          triggered after all nodes are finished loading
        */
        treeObject.on('ready.jstree', function() {
            Ember.run(this, function() {
                this.set('isReady', true);
                this.sendAction('eventDidBecomeReady');
            });
        }.bind(this));

        /*
          Event: redraw.jstree
          Action: eventDidRedraw
          triggered after nodes are redrawn
        */
        treeObject.on('redraw.jstree', function() {
            Ember.run(this, function() {
                this.sendAction('eventDidRedraw');
            });
        }.bind(this));

        /*
          Event: after_open.jstree
          Action: eventDidOpen
          triggered when a node is opened and the animation is complete
        */
        treeObject.on('after_open.jstree', function(e, data) {
            Ember.run(this, function() {
                this.sendAction('eventDidOpen', data.node);
            });
        }.bind(this));

        /*
          Event: after_close.jstree
          Action: eventDidClose
          triggered when a node is closed and the animation is complete
        */
        treeObject.on('after_close.jstree', function(e, data) {
            Ember.run(this, function() {
                this.sendAction('eventDidClose', data.node);
            });
        }.bind(this));

        /*
          Event: select_node.jstree
          Action: eventDidSelectNode
          triggered when an node is selected
        */
        treeObject.on('select_node.jstree', function(e, data) {
            Ember.run(this, function() {
                this.sendAction('eventDidSelectNode', data.node, data.selected, data.event);
            });
        }.bind(this));

        /*
          Event: deselect_node.jstree
          Action: eventDidDeelectNode
          triggered when an node is deselected
        */
        treeObject.on('deselect_node.jstree', function(e, data) {
            Ember.run(this, function() {
                this.sendAction('eventDidDeselectNode', data.node, data.selected, data.event);
            });
        }.bind(this));

        /*
          Event: changed.jstree
          Action: jstreeDidChange
          triggered when selection changes
        */
        treeObject.on('changed.jstree', function (e, data) {
            Ember.run(this, function() {
                this.sendAction('eventDidChange', data);

                // Check if selection changed
                if(this.get('treeObject') && !(this.get('isDestroyed') || this.get('isDestroying'))) {
                    var selectionChangedEventNames = ["model", "select_node", "deselect_node", "select_all", "deselect_all"];
                    if (data.action && selectionChangedEventNames.indexOf(data.action) !== -1) {
                        var selNodes = Ember.A(this.get('treeObject').jstree(true).get_selected(true));
                        this.set('selectedNodes', selNodes);
                    }
                }
            });
        }.bind(this));
    },

    /**
     * Refreshes the data in the tree
     * TODO: Investigate why redraw(true) doesn't work...
     *
     * @method _redrawTree
     */
    _refreshTree: function() {
        var o = this.get('treeObject');
        var t = o.jstree(true);
        if (null !== t) {
            t.settings.core['data'] = this.get('data');
            t.refresh();
        }
    }.observes('data'),

    getTree: function() {
        var o = this.get('treeObject');
        return o.jstree(true);
    },

    actions: {

        contextmenuItemDidClick: function(actionName, node) {
            var tree = this.get('getTree');
            if (undefined !== actionName) {
                this.sendAction(actionName, node, tree);
            }
        }
    }

});
