import Ember from 'ember';

export default Ember.Controller.extend({
    jsTreeActionReceiver: null,

    data: [
        'Simple root node',
        {
            'text': 'Single child node',
            'type': 'single-child',
            'children': [
                'one child'
            ]
        },
        {
            'text' : 'Root node 2',
            'state' : {
                'opened' : true,
                'selected' : true
            },
            'children' : [
                {
                  'text' : 'Child 1'
                },
                'Child 2'
            ]
        }
    ],

    itemClicked: '',
    treeReady: 'No',

    plugins: "checkbox, wholerow, types, contextmenu",
    themes: {
        'name': 'proton',
        'responsive': true
    },

    checkboxOptions: {"keep_selected_style" : false},
    typesOptions: {
        'single-child': {
            'max_children': '1'
        }
    },

    contextmenuOptions: {
        "show_at_node": false,
        "items" : {
            "editItem": {
                "label": "Edit Item",
                "action": "editItemContextmenuAction"
            }
        }             
    },

    actions: {

        redraw: function() {
            this.get('jsTreeActionReceiver').send('redraw');
        },

        destroy: function() {
            this.get('jsTreeActionReceiver').send('destroy');
        },
        
        handleTreeSelectionChange: function(node) {
            if(node) {
                this.set("selectedNodes", node.text);
            }
        },

        editItemContextmenuAction: function() {
            var self = this;
            this.set('itemClicked', 'Edit item menu was clicked.');
            Ember.run.later(function() {
                self.set('itemClicked', '');
            }, 2000);
        },

        addChildByText: function(nodeTextName) {
            if (typeof nodeTextName !== 'string') {
                return;
            }

            var data = this.get('data');
            data.forEach(function(node, index) {
                if (typeof node === 'object' && node["text"] === nodeTextName) {
                    data[index].children.push('added child');
                }
            });
            this.set(data);
        },

        treeBecameReady: function() {
            this.set('treeReady', "Yes");
        }
    }
});
