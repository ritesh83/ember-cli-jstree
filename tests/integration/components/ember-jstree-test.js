import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, find } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import $ from "jquery";

module("Integration | Component | ember-jstree", function(hooks) {
  setupRenderingTest(hooks);

  test("events#eventDidOpen", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidOpen(e) {
        assert.equal(e, data.node);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidOpen=eventDidOpen
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("after_open.jstree", data);
  });

  test("events#eventDidClose", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidClose(e) {
        assert.equal(e, data.node);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidClose=eventDidClose
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("after_close.jstree", data);
  });

  test("events#eventDidChange", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidChange(e) {
        assert.equal(e, data);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidChange=eventDidChange
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("changed.jstree", data);
  });

  test("events#eventDidDehoverNode", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidDehoverNode(e) {
        assert.equal(e, data.node);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidDehoverNode=eventDidDehoverNode
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("dehover_node.jstree", data);
  });

  test("events#eventDidDeselectNode", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidDeselectNode(e) {
        assert.equal(e, data.node);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidDeselectNode=eventDidDeselectNode
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("deselect_node.jstree", data);
  });

  test("events#eventDidHoverNode", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidHoverNode(e) {
        assert.equal(e, data.node);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidHoverNode=eventDidHoverNode
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("hover_node.jstree", data);
  });

  test("events#eventDidInit", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidInit() {
        assert.notOk(arguments.length);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidInit=eventDidInit
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("init.jstree", data);
  });

  test("events#eventIsLoading", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventIsLoading() {
        assert.notOk(arguments.length);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventIsLoading=eventIsLoading
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("loading.jstree", data);
  });

  test("events#eventDidLoad", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidLoad() {
        assert.notOk(arguments.length);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidLoad=eventDidLoad
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("loaded.jstree", data);
  });

  test("events#eventDidBecomeReady", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidBecomeReady() {
        assert.notOk(arguments.length);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidBecomeReady=eventDidBecomeReady
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("ready.jstree", data);
  });

  test("events#eventDidRedraw", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidRedraw() {
        assert.notOk(arguments.length);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidRedraw=eventDidRedraw
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("redraw.jstree", data);
  });

  test("events#eventDidShowNode", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidShowNode(e) {
        assert.equal(e, data.node);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidShowNode=eventDidShowNode
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("show_node.jstree", data);
  });

  test("events#eventDidSelectNode", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidSelectNode(e) {
        assert.equal(e, data.node);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidSelectNode=eventDidSelectNode
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("select_node.jstree", data);
  });

  test("events#eventDidDestroy", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidDestroy() {
        assert.notOk(arguments.length);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidDestroy=eventDidDestroy
      }}
    `);
  });

  test("events#eventDidMoveNode", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidMoveNode(e) {
        assert.equal(e, data);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        eventDidMoveNode=eventDidMoveNode
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("move_node.jstree", data);
  });

  test("events#eventDidDisableCheckbox", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidDisableCheckbox(e) {
        assert.equal(e, data.node);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        plugins='checkbox'
        eventDidDisableCheckbox=eventDidDisableCheckbox
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("disable_checkbox.jstree", data);
  });

  test("events#eventDidEnableCheckbox", async function(assert) {
    const data = { node: {} };
    this.setProperties({
      data,
      eventDidEnableCheckbox(e) {
        assert.equal(e, data.node);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        plugins='checkbox'
        eventDidEnableCheckbox=eventDidEnableCheckbox
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("enable_checkbox.jstree", data);
  });

  test("events#eventDidCheckNode", async function(assert) {
    const data = { node: {}, selected: {}, event: {} };
    this.setProperties({
      data,
      eventDidCheckNode(node, selected, event) {
        assert.equal(node, data.node);
        assert.equal(selected, data.selected);
        assert.equal(event, data.event);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        plugins='checkbox'
        eventDidCheckNode=eventDidCheckNode
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("check_node.jstree", data);
  });

  test("events#eventDidUncheckNode", async function(assert) {
    const data = { node: {}, selected: {}, event: {} };
    this.setProperties({
      data,
      eventDidUncheckNode(node, selected, event) {
        assert.equal(node, data.node);
        assert.equal(selected, data.selected);
        assert.equal(event, data.event);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        plugins='checkbox'
        eventDidUncheckNode=eventDidUncheckNode
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("uncheck_node.jstree", data);
  });

  test("events#eventDidCheckAll", async function(assert) {
    const data = { selected: {} };
    this.setProperties({
      data,
      eventDidCheckAll(e) {
        assert.equal(e, data.selected);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        plugins='checkbox'
        eventDidCheckAll=eventDidCheckAll
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("check_all.jstree", data);
  });

  test("events#eventDidUncheckAll", async function(assert) {
    const data = { node: {}, selected: {} };
    this.setProperties({
      data,
      eventDidUncheckAll(node, selected) {
        assert.equal(node, data.node);
        assert.equal(selected, data.selected);
      }
    });

    await render(hbs`
      {{ember-jstree
        data=data
        plugins='checkbox'
        eventDidUncheckAll=eventDidUncheckAll
      }}
    `);

    const tree = $(find(".jstree"));
    tree.trigger("uncheck_all.jstree", data);
  });
});
