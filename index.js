/* jshint node: true */
'use strict';

var pickFiles = require('broccoli-static-compiler');

module.exports = {
    name: 'ember-cli-jstree',

    included: function (app) {
        this._super.included(app);
        app.import(app.bowerDirectory + '/jstree/dist/jstree.min.js');
        app.import(app.bowerDirectory + '/jstree/dist/themes/default/style.min.css');
        app.import(app.bowerDirectory + '/jstree/dist/themes/default-dark/style.min.css');
    },

    treeForPublic: function(treeName) {
        var tree;

        tree = pickFiles(this.app.bowerDirectory + '/jstree/dist/themes/default', {
            srcDir: '/',
            files: ['**/*'],
            destDir: '/assets'
        });

        return tree;
    }
};
