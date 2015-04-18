/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');

module.exports = {
    name: 'ember-cli-jstree',

    included: function (app) {
        this._super.included(app);
        app.import(app.bowerDirectory + '/jstree/dist/jstree.min.js');
        app.import(app.bowerDirectory + '/jstree/dist/themes/default/style.min.css');
        app.import(app.bowerDirectory + '/jstree/dist/themes/default/32px.png');
        app.import(app.bowerDirectory + '/jstree/dist/themes/default/40px.png');
        app.import(app.bowerDirectory + '/jstree/dist/themes/default/throbber.gif');
    },

    treeForPublic: function() {
        var defaultThemePath = path.join(this.app.bowerDirectory, 'jstree', 'dist', 'themes', 'default');
        var defaultThemeAssets = new Funnel(this.treeGenerator(defaultThemePath), {
            srcDir: '/',
            include: ['**/*'],
            destDir: '/assets'
        });

        return defaultThemeAssets;
    }

};
