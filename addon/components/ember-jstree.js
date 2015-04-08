import Ember from 'ember';

export default Ember.Component.extend({
    data: null,
    plugins: null,
    checkboxOptions: null,
    selectionDidChange: null,

    didInsertElement: function() {
        var configObject = {};

        configObject["core"] = {"data" : this.get('data')};

        var pluginsArray = this.get('plugins').replace(/ /g, '').split(',');
        configObject["plugins"] = pluginsArray;

        if (pluginsArray.indexOf("contextmenu") !== -1 ||
            pluginsArray.indexOf("dnd") !== -1 ||
            pluginsArray.indexOf("unique") !== -1) {
            // These plugins need core.check_callback
            configObject["core"]["check_callback"] = true;
        }

        var checkboxOptions = this.get('checkboxOptions');
        if(checkboxOptions && pluginsArray.indexOf("checkbox") !== -1) {
            configObject["checkbox"] = checkboxOptions;
        }

        var typesOptions = this.get('typesOptions');
        if(typesOptions && pluginsArray.indexOf("types") !== -1) {
            configObject["types"] = typesOptions;
        }

        var contextMenuOptions = this.get('contextMenuOptions');
        if (contextMenuOptions && pluginsArray.indexOf("contextmenu") !== -1) {
            configObject["contextmenu"] = contextMenuOptions;
        }

        var treeObject = this.$().jstree(configObject);
        treeObject.on('changed.jstree', function (e, data) {
            this.sendAction("selectionDidChange", data.node);
        }.bind(this));
    },

    willDestroyElement: function() {

    }
});
