import { click, fillIn, findAll, find, visit } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";

module("Acceptance - ember-cli-jstree", function(hooks) {
  setupApplicationTest(hooks);

  test("Has static demo", async function(assert) {
    assert.expect(1);

    await visit("/static");

    assert.equal(
      findAll(".sample-tree").length,
      1,
      "Static page contains a sample tree"
    );
  });

  test("Destroy button destroys jstreeObject", async function(assert) {
    assert.expect(1);

    await visit("/static");
    await click(".ember-test-destroy-button");

    assert.equal(
      findAll(".sample-tree:first-child").length,
      0,
      "Tree should be destroyed"
    );
  });

  test("Get Node button gets correct node", async function(assert) {
    assert.expect(2);

    await visit("/static");
    await click(".ember-test-getnode-button");

    const object = {
      id: "rn2",
      text: "Opened node (has tooltip)",
      icon: true,
      parent: "#",
      parents: ["#"],
      children: ["j1_5", "j1_6"],
      children_d: ["j1_5", "j1_6"],
      data: null,
      state: { loaded: true, opened: true, selected: true, disabled: false },
      li_attr: { id: "rn2" },
      a_attr: {
        href: "#",
        class: "hint--bottom",
        "data-hint": "This is a bottom mounted node tooltip",
        id: "rn2_anchor"
      },
      original: {
        id: "rn2",
        text: "Opened node (has tooltip)",
        state: { opened: true, selected: true },
        class: "hint--bottom",
        a_attr: {
          class: "hint--bottom",
          "data-hint": "This is a bottom mounted node tooltip"
        }
      }
    };

    const compare = JSON.parse(find(".ember-test-buffer").textContent);

    assert.equal(
      compare.text,
      object.text,
      "getNode should return the correct node title"
    );

    assert.equal(
      compare.parent,
      object.parent,
      "getNode should return the correct node parent ID (#)"
    );
  });

  test("Search filters to correct nodes", async function(assert) {
    assert.expect(3);

    await visit("/static");

    assert.equal(
      findAll(".sample-tree li.jstree-hidden").length,
      0,
      "All nodes begin visible"
    );

    await fillIn(".search-input", "Single child node");

    assert.equal(
      findAll(".sample-tree li:not(.jstree-hidden)").length,
      1,
      "Only matching node shown after search"
    );

    await fillIn(".search-input", "");

    assert.equal(
      findAll(".sample-tree li.jstree-hidden").length,
      0,
      "All nodes are visible after clearing search"
    );
  });

  test("Has dynamic demo", async function(assert) {
    assert.expect(1);

    await visit("/dynamic");

    assert.equal(
      findAll(".sample-tree").length,
      1,
      "Dynamic page contains a sample tree"
    );
  });
});
