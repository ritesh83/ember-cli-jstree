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

    data: {
        'url' : function (node) {
            return node.id === '#' ? 
                '/ajax_data_roots.json' : 
                '/ajax_data_children.json';
        },
        'data' : function (node) {
            return { 'id' : node.id };
        }
    },

    lastItemClicked: '',
    treeReady: false,


    plugins: "wholerow",
    themes: {
        'name': 'default-dark',
        'responsive': true
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