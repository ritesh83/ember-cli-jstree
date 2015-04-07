import Ember from 'ember';

export default Ember.Controller.extend({
    data: [
        'Simple root node',
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

    plugins: "checkbox, wholerow",

    checkboxOptions: {"keep_selected_style" : false},

    actions: {
        handleTreeSelectionChange: function(node) {
            if(node) {
                this.set("selectedNodes", node.text);
            }
        }
    }
});
