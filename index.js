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

    treeForPublic: function() {
        this._requireBuildPackages();

        var tree = new Funnel(this.app.bowerDirectory + '/jstree/dist/themes/default', {
            srcDir: '/',
            files: ['**/*'],
            destDir: '/assets'
        });
        
        return tree;
    }
};
