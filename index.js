/* jshint node: true */
'use strict';

module.exports = {
    name: 'ember-cli-jstree',

    included: function (app) {
        this._super.included(app);
        app.import(app.bowerDirectory + '/jstree/dist/jstree.min.js');
        app.import(app.bowerDirectory + '/jstree/dist/themes/default/style.css');
    },

    treeForPublic: function(treeName) {
        this._requireBuildPackages();

        var tree;

        tree = this.pickFiles(this.app.bowerDirectory + '/jstree/dist/themes/default', {
            srcDir: '/',
            files: ['**/*'],
            destDir: '/assets'
        });
        
        return tree;
    }
};
