import Ember from 'ember';

export default Ember.Controller.extend({
    jstreeActionReceiver: null,
    jstreeSelectedNodes: Ember.A(),
    sortedSelectedNodes: Ember.computed.sort('jstreeSelectedNodes', function(a, b) {
        if (a.text > b.text) {
            return 1;
        } else if (a.text < b.text) {
            return -1;
        } else {
            return 0;
        }
    }),

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

    lastItemClicked: '',
    treeReady: false,

    plugins: "checkbox, wholerow, state, types, contextmenu",
    themes: {
        'name': 'default',
        'responsive': true
    },

    checkboxOptions: {"keep_selected_style" : false},

    stateOptions: {
        'key': 'ember-cli-jstree-dummy'
    },

    typesOptions: {
        'single-child': {
            'max_children': '1'
        }
    },

    contextmenuOptions: {
        "show_at_node": false,
        "items" : {
            "reportClicked": {
                "label": "Report Clicked",
                "action": "contextMenuReportClicked"
            }
        }             
    },

    actions: {

        redraw: function() {
            this.get('jstreeActionReceiver').send('redraw');
        },

        destroy: function() {
            this.get('jstreeActionReceiver').send('destroy');
        },

        handleTreeSelectionDidChange: function(data) {
            var selected = this.get('jsTreeActionReceiver').send('getSelected');
        },

        contextMenuReportClicked: function(node, tree) {
            var self = this;
            this.set('lastItemClicked', '"Report" item for node: <' + node.text + '> was clicked.');
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

        handleTreeDidBecomeReady: function() {
            this.set('treeReady', true);
        }
    }
    
});