"use strict";

const mergeTrees = require("broccoli-merge-trees");
const Funnel = require("broccoli-funnel");
const path = require("path");
const version = require("./package.json").version;
const writeFile = require("broccoli-file-creator");

module.exports = {
  name: "ember-cli-jstree",

  _jstreePath() {
    return path.dirname(require.resolve("jstree/package.json"));
  },

  included(app) {
    this._super.included.apply(this, app);

    if (process.env.EMBER_CLI_FASTBOOT) {
      return;
    }

    app.import("vendor/ember-cli-jstree/jstree.js");
    app.import("vendor/ember-cli-jstree/style.css");
    app.import("vendor/ember-cli-jstree/register-version.js");
  },

  treeForVendor(tree) {
    let registerVersionTree = writeFile(
      "ember-cli-jstree/register-version.js",
      `Ember.libraries.register('Ember CLI jsTree', '${version}')`
    );

    let stylesTree = new Funnel(
      path.join(this._jstreePath(), "dist/themes/default"),
      {
        include: ["*.css"],
        destDir: "ember-cli-jstree"
      }
    );

    let jsTree = new Funnel(path.join(this._jstreePath(), "dist"), {
      include: ["*.js"],
      destDir: "ember-cli-jstree"
    });

    return mergeTrees([tree, registerVersionTree, jsTree, stylesTree], {
      overwrite: true
    });
  },

  treeForPublic() {
    return new Funnel(path.join(this._jstreePath(), "dist/themes/default"), {
      include: ["**/*.png", "**/*.gif"],
      destDir: "/assets"
    });
  }
};
