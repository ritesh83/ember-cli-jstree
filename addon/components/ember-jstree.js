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
    worker:               true,

    // Refresh configuration variables
    skipLoading:          false,
    forgetState:          false,

    // Plugin option objects
    checkboxOptions:      null,
    contextmenuOptions:   null,
    typesOptions:         null,
    searchOptions:        null,
    dndOptions:           null,

    selectionDidChange:   null,
    treeObject:           null,

    // Internals
    _isDestroying:        false,

    isReady:              false,
    _searchTerm:          null,

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

    didUpdateAttrs() {
        this._super(...arguments);

        let pluginsArray = this.get('plugins');
        if (Ember.isPresent(pluginsArray)) {
            let searchOptions = this.get('searchOptions');
            if (Ember.isPresent(searchOptions) && pluginsArray.indexOf('search') >= 0) {
                let searchTerm = this.get('searchTerm');
                if (this.get('_searchTerm') !== searchTerm) {
                    Ember.run.next('afterRender', () => {
                        this.set('_searchTerm', searchTerm);
                        this.getTree().search(searchTerm);
                    });
                }
            }
        }
    },

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

        configObject['core'] = {
            'data': this.get('data'),
            'check_callback': this.get('checkCallback'),
            'multiple': this.get('multiple'),
            'worker': this.get('worker')
        };

        let themes = this.get('themes');
        if (Ember.isPresent(themes) && Ember.typeOf(themes) === 'object') {
            configObject['core']['themes'] = themes;
        }

        let pluginsArray = this.get('plugins');
        if (Ember.isPresent(pluginsArray)) {
            pluginsArray = pluginsArray.replace(/ /g, '').split(',');
            configObject['plugins'] = pluginsArray;

            if (pluginsArray.includes('contextmenu') ||
                pluginsArray.includes('dnd') ||
                pluginsArray.includes('unique')) {
                // These plugins need core.check_callback
                configObject['core']['check_callback'] = configObject['core']['check_callback'] || true;
            }

            let checkboxOptions = this.get('checkboxOptions');
            if (Ember.isPresent(checkboxOptions) && pluginsArray.includes('checkbox')) {
                configObject['checkbox'] = checkboxOptions;
            }

            let searchOptions = this.get('searchOptions');
            if (Ember.isPresent(searchOptions) && pluginsArray.includes('search')) {
                configObject['search'] = searchOptions;
            }

            let stateOptions = this.get('stateOptions');
            if (Ember.isPresent(stateOptions) && pluginsArray.includes('state')) {
                configObject['state'] = stateOptions;
            }

            let typesOptions = this.get('typesOptions');
            if (Ember.isPresent(typesOptions) && pluginsArray.includes('types')) {
                configObject['types'] = typesOptions;
            }

            let contextmenuOptions = this.get('contextmenuOptions');
            if (Ember.isPresent(contextmenuOptions) && pluginsArray.includes('contextmenu')) {
                configObject['contextmenu'] = this._setupContextMenus(contextmenuOptions);
            }

            let dndOptions = this.get('dndOptions');
            if (Ember.isPresent(dndOptions) && pluginsArray.includes('dnd')) {
                configObject['dnd'] = dndOptions;
            }
        }

        return configObject;
    },

    /**
     * Setup context menu action handlers to handle ember actions
     *
     * @method _setupContextMenus
     * @param  {Array} contextmenuOptions Context menu configuration options
     * @return {Array} An Array of Ember-friendly options to pass back into the config object
     */
    _setupContextMenus(contextmenuOptions) {
        if (Ember.typeOf(contextmenuOptions['items']) === 'object') {
            let newMenuItems = {};
            let menuItems = Object.keys(contextmenuOptions['items']);
            for (let menuItem of menuItems) {
                let itemData = contextmenuOptions['items'][menuItem];
                newMenuItems[menuItem] = itemData;

                // Only change if not a function
                // This needs to be done to handle Ember actions
                if (Ember.typeOf(itemData['action']) !== 'function') {
                    let emberAction = itemData['action'];

                    newMenuItems[menuItem]['action'] = (data) => {
                        this.send("contextmenuItemDidClick", emberAction, data);
                    };
                }
            }

            contextmenuOptions['items'] = newMenuItems;
        }

        return contextmenuOptions;
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
          Event: loading.jstree
          Action: eventIsLoading
          triggered after the loading text is shown and before loading starts
        */
        treeObject.on('loading.jstree', () => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventIsLoading');
            });
        });

        /*
          Event: loaded.jstree
          Action: eventDidLoad
          triggered after the root node is loaded for the first time
        */
        treeObject.on('loaded.jstree', () => {
            Ember.run(this, function() {
                if (this.get('isDestroyed') || this.get('isDestroying')) {
                    return;
                }
                this.sendAction('eventDidLoad');
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

                // Check if selection changed
                if (Ember.isPresent(this.get('treeObject'))) {
                    let selectionChangedEventNames = [
                        'model',
                        'select_node',
                        'deselect_node',
                        'select_all',
                        'deselect_all'
                    ];
                    if (Ember.isPresent(data.action) && selectionChangedEventNames.includes(data.action)) {
                        let selNodes = Ember.A(this.get('treeObject').jstree(true).get_selected(true));
                        this.set('selectedNodes', selNodes);
                    }
                }

                this.sendAction('eventDidChange', data);
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


      if (this.get('plugins').indexOf('checkbox') > -1) {

        /*
           Event: disable_checkbox.jstree
           Action: eventDidDisableCheckbox
           triggered when an node's checkbox is disabled
         */
        treeObject.on('disable_checkbox.jstree', (event, data) => {
          Ember.run(this, function() {
            if (this.get('isDestroyed') || this.get('isDestroying')) {
              return;
            }
            this.sendAction('eventDidDisableCheckbox', data.node);
          });
        });

        /*
           Event: enable_checkbox.jstree
           Action: eventDidEnableCheckbox
           triggered when an node's checkbox is enabled
         */
        treeObject.on('enable_checkbox.jstree', (event, data) => {
          Ember.run(this, function() {
            if (this.get('isDestroyed') || this.get('isDestroying')) {
              return;
            }
            this.sendAction('eventDidEnableCheckbox', data.node);
          });
        });

        if (Ember.isPresent('checkboxOptions.tie_selected') && !this.get('checkboxOptions.tie_selected')) {

          /*
             Event: check_node.jstree
             Action: eventDidCheckNode
             triggered when an node is checked (only if tie_selection in checkbox settings is false)
           */
          treeObject.on('check_node.jstree', (event, data) => {
            Ember.run(this, function() {
              if (this.get('isDestroyed') || this.get('isDestroying')) {
                return;
              }
              this.sendAction('eventDidCheckNode', data.node, data.selected, data.event);
            });
          });

          /*
             Event: uncheck_node.jstree
             Action: eventDidUncheckNode
             triggered when an node is unchecked (only if tie_selection in checkbox settings is false)
           */
          treeObject.on('uncheck_node.jstree', (event, data) => {
            Ember.run(this, function() {
              if (this.get('isDestroyed') || this.get('isDestroying')) {
                return;
              }
              this.sendAction('eventDidUncheckNode', data.node, data.selected, data.event);
            });
          });

          /*
             Event: check_all.jstree
             Action: eventDidCheckAll
             triggered when all nodes are checked (only if tie_selection in checkbox settings is false)
           */
          treeObject.on('check_all.jstree', (event, data) => {
            Ember.run(this, function() {
              if (this.get('isDestroyed') || this.get('isDestroying')) {
                return;
              }
              this.sendAction('eventDidCheckAll', data.selected);
            });
          });

          /*
             Event: uncheck_all.jstree
             Action: eventDidUncheckAll
             triggered when all nodes are unchecked (only if tie_selection in checkbox settings is false)
           */
          treeObject.on('uncheck_all.jstree', (event, data) => {
            Ember.run(this, function() {
              if (this.get('isDestroyed') || this.get('isDestroying')) {
                return;
              }
              this.sendAction('eventDidUncheckAll', data.node, data.selected);
            });
          });
        }
      }
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

        contextmenuItemDidClick(actionName, data) {
            let emberTreeObj = this.get('getTree');

            let instance = Ember.$.jstree.reference(data.reference);
			let node = instance.get_node(data.reference);

            if (Ember.isPresent(actionName)) {
                this.sendAction(actionName, node, emberTreeObj);
            }
        }
    }

});
