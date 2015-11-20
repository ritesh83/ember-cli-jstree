import Ember from 'ember';

export default Ember.Controller.extend({
    jstreeActionReceiver: null,
    jstreeSelectedNodes: Ember.A(),
    jstreeBuffer: null,
    jsonifiedBuffer: '<No output>',

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
            'text': 'Single child node (has tooltip)',
            'type': 'single-child',
            'children': [
                'one child'
            ],
            'a_attr': {'class': 'hint--top', 'data-hint': 'Use a_attr to add tooltips'}
        },
        {
            'id': 'rn2',
            'text' : 'Opened node (has tooltip)',
            'state' : {
                'opened' : true,
                'selected' : true
            },
            'a_attr': {'class': 'hint--bottom', 'data-hint': 'This is a bottom mounted node tooltip'},
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

    _jsonifyBufferWatcher: Ember.observer('jstreeBuffer', function() {
        var b = this.get('jstreeBuffer');

        if (null !== b && b) {
            this.set('jsonifiedBuffer', JSON.stringify(b));
        } else {
            this.set('jsonifiedBuffer', '<No output>');
        }
    }),

    actions: {

        redraw: function() {
            this.get('jstreeActionReceiver').send('redraw');
        },

        destroy: function() {
            this.get('jstreeActionReceiver').send('destroy');
        },

        getNode: function(nodeId) {
            this.get('jstreeActionReceiver').send('getNode', nodeId);
        },

        handleGetNode: function(node) {
            if (node) {
                this.set('jstreeBuffer', node);
            }
        },

        contextMenuReportClicked: function(node) {
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
            this.set('data', data);
            this.send('redraw');
        },

        handleTreeDidBecomeReady: function() {
            this.set('treeReady', true);
        }
    }

});
