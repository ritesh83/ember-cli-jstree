module.exports = {
    normalizeEntityName: function() {},

    afterInstall: function() {
        return this.addBowerPackagesToProject([
          { name : 'jstree' }
        ]);
    }
};
