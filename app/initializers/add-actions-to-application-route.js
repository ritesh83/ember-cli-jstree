import Ember from 'ember';

export default {
    name: 'add-actions-to-application-route',
    initialize: function(container, app) {
        Ember.run.next(function() {
            var appRoute = container.lookup('route:application');
            if (appRoute && typeof appRoute.reopen === 'function') {
                appRoute.reopen({
                    actions: {
                        destroyTree: function(keepHtml) {
                            keepHtml = keepHtml || false;
                            console.info('destroyTree was called.');
                            debugger;
                            Ember.$().jstree().destroy(keepHtml);
                        }
                    }
                });
            }
        });
    }
};