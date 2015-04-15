import Ember from 'ember';

/**
* This mixin assists in setting up various event handlers that take jstree events and
* fire off corresponding Ember actions back to the component view handler.
*
* @class EmberJstreeEvents
*/
export default Ember.Mixin.create({

    /**
     * Register all sorts of events
     * TODO: This should eventually encompass all of the jsTree events declared in their API.
     *
     * @method _setupEventHandlers
     * @param  {Object}
     * @return
     */
    _setupEventHandlers: function(treeObject) {

        if (typeof treeObject !== 'object') {
            throw new Error('You must pass a valid jsTree object to set up its event handlers');
        }

        /*
          Event: init.jstree
          Action: jstreeDidInit
          triggered after all events are bound
        */
        treeObject.on('init.jstree', function() {
            this.sendAction('eventDidInit');
        }.bind(this));

        /*
          Event: ready.jstree
          Action: jstreeDidBecomeReady
          triggered after all nodes are finished loading
        */
        treeObject.on('ready.jstree', function() {
            this.sendAction('eventDidBecomeReady');
        }.bind(this));

        /*
          Event: redraw.jstree
          Action: jstreeDidRedraw
          triggered after nodes are redrawn
        */
        treeObject.on('redraw.jstree', function() {
            this.sendAction('eventDidRedraw');
        }.bind(this));

        /*
          Event: changed.jstree
          Action: jstreeDidChange
          triggered when selection changes
        */
        treeObject.on('changed.jstree', function (e, data) {
            this.sendAction('eventDidChange', data);

            // Check if selection changed
            if(this.get('treeObject')) {
                var selectionChangedEventNames = ["model", "select_node", "deselect_node", "select_all", "deselect_all"];
                if (data.action && selectionChangedEventNames.indexOf(data.action) !== -1) {
                    var selNodes = Ember.A(this.get('treeObject').jstree(true).get_selected(true));
                    this.set('selectedNodes', selNodes);
                }
            }
        }.bind(this));
    }
});