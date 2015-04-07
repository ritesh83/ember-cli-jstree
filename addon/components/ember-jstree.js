import Ember from 'ember';

export default Ember.Component.extend({
    data: null,
    plugins: null,
    checkboxOptions: null,
    selectionDidChange: null,

    didInsertElement: function() {
        var configObject = {};

        configObject["core"] = {"data" : this.get('data')};

        var pluginsArray = this.get('plugins').trim().split(',');
        configObject["plugins"] = pluginsArray;

        var checkboxOptions = this.get('checkboxOptions');
        if(checkboxOptions && pluginsArray.indexOf("checkbox") !== -1) {
            configObject["checkbox"] = checkboxOptions;
        }

        var treeObject = this.$().jstree(configObject);
        treeObject.on('changed.jstree', function (e, data) {
            this.sendAction("selectionDidChange", data.node);
        }.bind(this));
    },

    willDestroyElement: function() {

    }
});
