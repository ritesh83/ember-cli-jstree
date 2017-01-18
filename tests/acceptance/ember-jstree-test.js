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
    visit('/static').andThen(function() {
        assert.equal(find('.sample-tree').length, 1, 'Static page contains a sample tree');
    });
});

test('Destroy button destroys jstreeObject', function(assert) {
    assert.expect(1);

    visit('/static');
    click('.ember-test-destroy-button');
    andThen(function() {
        assert.equal(find('.sample-tree:first-child').length, 0, 'Tree should be destroyed');
    });
});

test('Get Node button gets correct node', function(assert) {
    assert.expect(2);

    visit('/static');
    andThen(function() {
        click('.ember-test-getnode-button');
        var done = assert.async();
        Ember.run.later(function() {
            done();
            var object = {"id":"rn2","text":"Opened node (has tooltip)","icon":true,"parent":"#","parents":["#"],"children":["j1_5","j1_6"],"children_d":["j1_5","j1_6"],"data":null,"state":{"loaded":true,"opened":true,"selected":true,"disabled":false},"li_attr":{"id":"rn2"},"a_attr":{"href":"#","class":"hint--bottom","data-hint":"This is a bottom mounted node tooltip","id":"rn2_anchor"},"original":{"id":"rn2","text":"Opened node (has tooltip)","state":{"opened":true,"selected":true},"class":"hint--bottom","a_attr":{"class":"hint--bottom","data-hint":"This is a bottom mounted node tooltip"}}};
            var compare = JSON.parse(find('.ember-test-buffer').text());
            assert.equal(compare.text, object.text, 'getNode should return the correct node title');
            assert.equal(compare.parent, object.parent, 'getNode should return the correct node parent ID (#)');
        }, 1500);
    });
});

test('Search filters to correct nodes', function(assert) {
    visit('/static');
    andThen(function() {
        assert.equal(find('.sample-tree li.jstree-hidden').length, 0, 'All nodes begin visible');
    });
    fillIn('.search-input', 'Single child node');
    andThen(function() {
        assert.equal(find('.sample-tree li:not(.jstree-hidden)').length, 1, 'Only matching node shown after search');
    });
    fillIn('.search-input', '');
    andThen(function() {
        assert.equal(find('.sample-tree li.jstree-hidden').length, 0, 'All nodes are visible after clearing search');
    });
});

test('Has dynamic demo', function(assert) {
    assert.expect(1);
    visit('/dynamic').andThen(function() {
        assert.equal(find('.sample-tree').length, 1, 'Dynamic page contains a sample tree');
    });
});
