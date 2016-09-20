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
    multiple:             true,

    // Refresh configuration variables
    skipLoading:          false,
    forgetState:          false,

    // Plugin option objects
    checkboxOptions:      null,
    contextmenuOptions:   null,
    typesOptions:         null,
    searchOptions:        null,

    selectionDidChange:   null,
    treeObject:           null,

    // Internals
    _isDestroying:        false,

    isReady:              false,

    _isReadyTestWaiter() {
        return this.get('isReady') === true;
    },

    didInsertElement() {
        Ember.run.schedule('afterRender', this, this.createTree);
    },

    createTree() {
        if (Ember.testing) {
            // Add test waiter.
            Ember.Test.registerWaiter(this, this._isReadyTestWaiter);
        }

        let treeObject = this._setupJsTree();

        this._setupEventHandlers(treeObject);

        this.set('treeObject', treeObject);
    },

    willDestroyElement() {
        if (Ember.testing) {
            Ember.Test.unregisterWaiter(this, this._isReadyTestWaiter);
        }

        this.set('isReady', false);
        this.set('_isDestroying', true);
        this.send('destroy');
    },

    searchTermChanged: Ember.observer('searchTerm', function() {
        let searchTerm = this.get('searchTerm');
        this.getTree().search(searchTerm);
    }),

    /**
    * Main setup function that registers all the plugins and sets up the core
    * configuration object for jsTree
    *
    * @method _setupJsTree
    */
    _setupJsTree() {
        return this.$().jstree(this._buildConfig());
    },

    /**
    * Builds config object for jsTree. Could be used to override config in descendant classes.
    *
    * @method _buildConfig
    */
    _buildConfig() {
        let configObject = {};
        configObject["core"] = {
            "data": this.get('data'),
            "check_callback": this.get('checkCallback'),
            "multiple": this.get('multiple')
        };

        let themes = this.get('themes');
        if (themes && typeof themes === "object") {
            configObject["core"]["themes"] = themes;
        }

        let pluginsArray = this.get('plugins');
        if (pluginsArray) {
            pluginsArray = pluginsArray.replace(/ /g, '').split(',');
            configObject["plugins"] = pluginsArray;

            if (pluginsArray.indexOf("contextmenu") !== -1 ||
                pluginsArray.indexOf("dnd") !== -1 ||
                pluginsArray.indexOf("unique") !== -1) {
                // These plugins need core.check_callback
                configObject["core"]["check_callback"] = configObject["core"]["check_callback"] || true;
            }

            let checkboxOptions = this.get('checkboxOptions');
            if (checkboxOptions && pluginsArray.indexOf("checkbox") !== -1) {
                configObject["checkbox"] = checkboxOptions;
            }

            let searchOptions = this.get('searchOptions');
            if (searchOptions && pluginsArray.indexOf("search") !== -1) {
                searchOptions["search_callback"] = this.searchCallback;
                configObject["search"] = searchOptions;
            }

            let stateOptions = this.get('stateOptions');
            if (stateOptions && pluginsArray.indexOf("state") !== -1) {
                configObject["state"] = stateOptions;
            }

            let typesOptions = this.get('typesOptions');
            if (typesOptions && pluginsArray.indexOf("types") !== -1) {
                configObject["types"] = typesOptions;
            }

            configObject["contextmenu"] = this._setupContextMenus(pluginsArray);
        }

        return configObject;
    },

    /**
     * We essentially need to hijack the jstree contextmenu plugin in order for us
     * to do messaging between this Ember addon/component and jstree
     *
     * @method _setupContextMenus
     * @param  {Array} pluginsArray Array of plugins to be used
     * @return {Array} An Array of Ember-friendly options to pass back into the config object
     */
    _setupContextMenus(pluginsArray) {
        let contextmenuOptions = this.get('contextmenuOptions');

        if (null === pluginsArray) {
            return;
        }

        // This has eventually got to go. It's terrible.
        if (contextmenuOptions && pluginsArray.indexOf("contextmenu") !== -1) {
            // Remap action hash to functions and don't forget to pass node through
            if (typeof contextmenuOptions["items"] === "object") {
                let newMenuItems = {};
                for (let menuItem in contextmenuOptions["items"]) {
                    if (contextmenuOptions["items"].hasOwnProperty(menuItem)) {
                        // Copy over everything first
                        newMenuItems[menuItem] = contextmenuOptions["items"][menuItem];

                        // Only change it if it's a string. If a function, leave it
                        // This needs to be done so Ember can hijack the action and call it instead
                        if (typeof contextmenuOptions["items"][menuItem]["action"] === "string") {
                            let emberAction = contextmenuOptions["items"][menuItem]["action"];
                            newMenuItems[menuItem]["action"] = (function(self, action) {
                                return function() {
                                    Ember.run(self, function() {
                                        let node = self.get('currentNode');
                                        self.send("contextmenuItemDidClick", action, node);
                                    });
                                };
                            })(this, emberAction);
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
    _setupEventHandlers(treeObject) {

        if (typeof treeObject !== 'object') {
            throw new Error('You must pass a valid jsTree object to set up its event handlers');
        }

        /*
          Event: init.jstree
          Action: eventDidInit
          triggered after all events are bound
        */
        treeObject.on('init.jstree', () => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidInit');
            });
        });

        /*
          Event: ready.jstree
          Action: eventDidBecomeReady
          triggered after all nodes are finished loading
        */
        treeObject.on('ready.jstree', () => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.set('isReady', true);
                this.sendAction('eventDidBecomeReady');
            });
        });

        /*
          Event: redraw.jstree
          Action: eventDidRedraw
          triggered after nodes are redrawn
        */
        treeObject.on('redraw.jstree', () => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidRedraw');
            });
        });

        /*
          Event: after_open.jstree
          Action: eventDidOpen
          triggered when a node is opened and the animation is complete
        */
        treeObject.on('after_open.jstree', (event, data) => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidOpen', data.node);
            });
        });

        /*
          Event: after_close.jstree
          Action: eventDidClose
          triggered when a node is closed and the animation is complete
        */
        treeObject.on('after_close.jstree', (event, data) => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidClose', data.node);
            });
        });

        /*
          Event: select_node.jstree
          Action: eventDidSelectNode
          triggered when an node is selected
        */
        treeObject.on('select_node.jstree', (event, data) => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidSelectNode', data.node, data.selected, data.event);
            });
        });

        /*
          Event: deselect_node.jstree
          Action: eventDidDeelectNode
          triggered when an node is deselected
        */
        treeObject.on('deselect_node.jstree', (event, data) => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidDeselectNode', data.node, data.selected, data.event);
            });
        });

        /*
          Event: changed.jstree
          Action: jstreeDidChange
          triggered when selection changes
        */
        treeObject.on('changed.jstree', (event, data) => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidChange', data);

                // Check if selection changed
                if (this.get('treeObject') && !(this.get('isDestroyed') || this.get('isDestroying'))) {
                    let selectionChangedEventNames = ["model", "select_node", "deselect_node", "select_all", "deselect_all"];
                    if (data.action && selectionChangedEventNames.indexOf(data.action) !== -1) {
                        let selNodes = Ember.A(this.get('treeObject').jstree(true).get_selected(true));
                        this.set('selectedNodes', selNodes);
                    }
                }
            });
        });

        /*
          Event: hover_node.jstree
          Action: eventDidHoverNode
          triggered when a node is hovered
        */
        treeObject.on('hover_node.jstree', (event, data) => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidHoverNode', data.node);
            });
        });

        /*
          Event: dehover_node.jstree
          Action: eventDidDehoverNode
          triggered when a node is no longer hovered
        */
        treeObject.on('dehover_node.jstree', (event, data) => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidDehoverNode', data.node);
            });
        });

        /*
          Event: show_node.jstree
          Action: eventDidShowNode
          triggered when a node is no longer hovered
        */
        treeObject.on('show_node.jstree', (event, data) => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidShowNode', data.node);
            });
        });

        /*
          Event: move_node.jstree
          Action: eventDidMoveNode
          triggered when a node is moved
        */
        treeObject.on('move_node.jstree', (event, data) => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidMoveNode', data);
            });
        });
    },

    /**
     * Refreshes the data in the tree
     * TODO: Investigate why redraw(true) doesn't work...
     *
     * @method _redrawTree
     */
    _refreshTree: Ember.observer('data', function() {
        let tree = this.getTree();
        if (null !== tree && false !== tree) {
            tree.settings.core['data'] = this.get('data');
            tree.refresh(this.get('skipLoading'), this.get('forgetState'));
        } else {
            // setup again if destroyed
            let treeObject = this._setupJsTree();
            this._setupEventHandlers(treeObject);
            this.set('treeObject', treeObject);
        }
    }),

    getTree() {
        let tree = this.get('treeObject');
        return tree.jstree(true);
    },

    actions: {

        contextmenuItemDidClick(actionName, node) {
            let tree = this.get('getTree');
            if (undefined !== actionName) {
                this.sendAction(actionName, node, tree);
            }
        }
    }

});
