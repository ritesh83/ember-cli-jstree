import Ember from 'ember';

/**
* Actions that are mapped to jstree and return Ember actions with parameters where necessary.
* These actions are passed to the addon via the actionReceiver property and are generally
* the same as jsTree method names, but camelized.
*
* @class EmberJstreeActions
*/
export default Ember.Mixin.create({
    actions: {
        redraw: function() {
            // Redraw true currently does not work as intended. Need to investigate.
            this._refreshTree();

            // var o = this.get('treeObject');
            // if (null !== o) {
            //     o.jstree(true).refresh(true);
            // }
        },

        destroy: function() {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).destroy();
            }
            this.sendAction('eventDidDestroy');
        },

        getNode: function(nodeId) {
            if (typeof nodeId !== "string") {
                throw new Error('getNode() requires a node ID to be passed to it to return the node!');
            }

            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionGetNode', o.jstree(true).get_node(nodeId));
            }
        },

        getText: function(obj) {
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionGetText', o.jstree(true).get_text(obj));
            }
        },

        getPath: function(obj, glue, ids) {
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionGetPath', o.jstree(true).get_path(obj, glue, ids));
            }
        },

        getChildrenDom: function(obj) {
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionGetChildrenDom', o.jstree(true).get_children_dom(obj));
            }
        },

        getContainer: function() {
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionGetContainer', o.jstree(true).get_container());
            }
        },

        getParent: function(obj) {
            obj = obj || "#";
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionGetParent', o.jstree(true).get_parent(obj));
            }
        },

        loadNode: function(obj, cb) {
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionLoadNode', o.jstree(true).load_node(obj, cb));
            }
        },

        loadAll: function(obj, cb) {
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionLoadAll', o.jstree(true).load_all(obj, cb));
            }
        },

        openNode: function(obj, cb, animation) {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).open_node(obj, cb, animation);
            }
        },

        openAll: function(obj, animation) {
            var o = this.get('treeObject');
            if (null !== o) {
               o.jstree(true).open_all(obj, animation);
            }
        },

        closeNode: function(obj, cb) {
            var o = this.get('treeObject');
            if (null !== o) {
               o.jstree(true).close_node(obj, cb);
            }
        },

        closeAll: function(obj, animation) {
            var o = this.get('treeObject');
            if (null !== o) {
               o.jstree(true).close_all(obj, animation);
            }
        },

        toggleNode: function(obj) {
            var o = this.get('treeObject');
            if (null !== o) {
               o.jstree(true).toggle_node(obj);
            }
        },

        createNode: function(obj, node, pos, callback, is_loaded) {
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionCreateNode', o.jstree(true).create_node(obj, node, pos, callback, is_loaded));
            }
        },

        renameNode: function(obj, val) {
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionRenameNode', o.jstree(true).rename_node(obj, val));
            }
        },

        moveNode: function(obj, par, pos, callback, is_loaded) {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).move_node(obj, par, pos, callback, is_loaded);
            }
        },

        copyNode: function(obj, par, pos, callback, is_loaded) {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).copy_node(obj, par, pos, callback, is_loaded);
            }
        },

        deleteNode: function(obj) {
            var o = this.get('treeObject');
            if (null !== o) {
                this.sendAction('actionDeleteNode', o.jstree(true).delete_node(obj));
            }
        },

        selectNode: function(obj, suppress_event) {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).select_node(obj, suppress_event);
            }
        },

        deselectNode: function(obj, suppress_event) {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).deselect_node(obj, suppress_event);
            }
        },

        selectAll: function(suppress_event) {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).select_all(suppress_event);
            }
        },

        deselectAll: function(suppress_event) {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).deselect_all(suppress_event);
            }
        },

        lastError: function() {
            var o = this.get('treeObject');
            if (null !== o) {
                var e = o.jstree(true).last_error();
                this.set('_lastError', e);
                this.sendAction('actionLastError', e);
            }
        },

        deselectNodes: function() {
            var o = this.get('treeObject');
            if (null !== o) {
                o.jstree(true).deselect_all();
            }
        },

        selectNodes: function(property, values) {
            if(this.plugins.indexOf("search") === -1) {
                 Ember.assert("'search' plugin is required to perform 'selectNodes'");
                 return;
            }

            var treeObject = this.get('treeObject');
            if (null !== treeObject) {
                this.set('search_property', property);

                treeObject.on('search.jstree', function(event, data) {
                    treeObject.jstree(true).select_node(data.nodes, true, true);
                }.bind(this));

                if(Ember.$.isArray(values)) {
                    for(var i=0; i<values.length; i++) {
                        treeObject.jstree(true).search(values[i]);
                    }

                    treeObject.jstree(true).clear_search();
                }
            }
        }
    }
});
