/* jshint node: true */
'use strict';

module.exports = {
    name: 'ember-cli-jstree',

    included: function (app) {
        this._super.included(app);
        app.import(app.bowerDirectory + '/jstree/dist/jstree.min.js');
        app.import(app.bowerDirectory + '/jstree/dist/themes/default/style.css');
    }

};
