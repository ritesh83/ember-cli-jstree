import Ember from 'ember';

export default Ember.Controller.extend({
    data: [
        'Simple root node',
        {
            'text': 'Root childless node type',
            'type': 'single-level',
            'children': [
                'one child',
                'two children',
                'three children'
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

    plugins: "checkbox, wholerow, types, contextmenu",

    checkboxOptions: {"keep_selected_style" : false},
    typesOptions: {
        'single-level': {
            'icon': 'test',
            'max_depth': '0',
            'max_children': '1'
        }
    },

    contextMenuOptions: {
        "items" : {
            
        }             
    },

    actions: {
        handleTreeSelectionChange: function(node) {
            if(node) {
                this.set("selectedNodes", node.text);
            }
        }
    }
});
