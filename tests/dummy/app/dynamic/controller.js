import Ember from 'ember';
import ENV from 'dummy/config/environment';

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
            if (ENV.environment === 'production') {
                return node.id === '#' ?
                    '/ember-cli-jstree/ajax_data_roots.json' :
                    '/ember-cli-jstree/ajax_data_children.json';
            } else {
                return node.id === '#' ?
                    '/ajax_data_roots.json' :
                    '/ajax_data_children.json';
            }
        },
        'data' : function (node) {
            return { 'id' : node.id };
        }
    },

    lastItemClicked: '',
    treeReady: false,


    plugins: "wholerow, dnd",
    themes: {
        'name': 'default',
        'responsive': true
    },

    actions: {

        redraw() {
            this.get('jstreeActionReceiver').send('redraw');
        },

        destroy() {
            this.get('jstreeActionReceiver').send('destroy');
        },

        handleTreeSelectionDidChange() {
            this.get('jsTreeActionReceiver').send('getSelected');
        },

        contextMenuReportClicked(node) {
            this.set('lastItemClicked', '"Report" item for node: <' + node.text + '> was clicked.');
        },

        addChildByText(nodeTextName) {
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

        handleTreeDidBecomeReady() {
            this.set('treeReady', true);
        },

        handleJstreeEventDidMoveNode(node) {
            console.log(node);
        }
    }

});
