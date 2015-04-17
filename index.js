/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');

module.exports = {
    name: 'ember-cli-jstree',

    included: function (app) {
        this._super.included(app);
        app.import(app.bowerDirectory + '/jstree/dist/jstree.min.js');
        app.import(app.bowerDirectory + '/jstree/dist/themes/default/style.css');
    },

    treeForVendor: function() {
        var dummyAssets = new Funnel('bower_components/jstree/dist/themes/default', {
            srcDir: '/',
            include: ['**/*'],
            destDir: '/assets'
        });

        return dummyAssets;
    }

};
