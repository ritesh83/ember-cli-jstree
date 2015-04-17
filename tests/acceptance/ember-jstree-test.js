import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
var App;

module('Acceptance - ember-cli-jstree', {
    beforeEach: function() {
        App = startApp();
        
        // PhantomJS doesn't support bind yet
        Function.prototype.bind = Function.prototype.bind || function (thisp) {
            var fn = this;
            return function () {
                return fn.apply(thisp, arguments);
            };
        }; 
    },

    afterEach: function() {
        Ember.run(App, App.destroy);
    }
});

test('Has static demo', function(assert) {
    assert.expect(1);
    visit('/static').then(function() {
        assert.equal(find('.sample-tree').length, 1, 'Static page contains a sample tree');
    });
});

test('Has dynamic demo', function(assert) {
    assert.expect(1);
    visit('/dynamic').then(function() {
        assert.equal(find('.sample-tree').length, 1, 'Dynamic page contains a sample tree');
    });
});
