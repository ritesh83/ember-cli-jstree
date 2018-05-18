import { sort } from "@ember/object/computed";
import Controller from "@ember/controller";
import { A } from "@ember/array";
import { computed, observer } from "@ember/object";

export default Controller.extend({
  jstreeActionReceiver: null,
  jstreeSelectedNodes: A(),
  jstreeBuffer: null,
  jsonifiedBuffer: "<No output>",
  searchTerm: "",

  sortedSelectedNodes: sort("jstreeSelectedNodes", function(a, b) {
    if (a.text > b.text) {
      return 1;
    } else if (a.text < b.text) {
      return -1;
    } else {
      return 0;
    }
  }),

  data: computed(() => [
    "Simple root node",
    {
      text: "Single child node (has tooltip)",
      type: "single-child",
      children: ["one child"],
      a_attr: { class: "hint--top", "data-hint": "Use a_attr to add tooltips" }
    },
    {
      id: "rn2",
      text: "Opened node (has tooltip)",
      state: {
        opened: true,
        selected: true
      },
      a_attr: {
        class: "hint--bottom",
        "data-hint": "This is a bottom mounted node tooltip"
      },
      children: [
        {
          text: "Child 1"
        },
        "Child 2"
      ]
    }
  ]),

  lastItemClicked: "",
  treeReady: false,

  plugins: "checkbox, wholerow, state, search, types, contextmenu",
  themes: computed(() => ({
    name: "default",
    responsive: true
  })),

  checkboxOptions: computed(() => ({ keep_selected_style: false })),
  searchOptions: computed(() => ({
    show_only_matches: true
  })),

  stateOptions: computed(() => ({
    key: "ember-cli-jstree-dummy"
  })),

  typesOptions: computed(() => ({
    "single-child": {
      max_children: "1"
    }
  })),

  contextmenuOptions: computed(() => ({
    show_at_node: false,
    items: {
      reportClicked: {
        label: "Report Clicked",
        action: "contextMenuReportClicked"
      }
    }
  })),

  _jsonifyBufferWatcher: observer("jstreeBuffer", function() {
    let b = this.get("jstreeBuffer");

    if (null !== b && b) {
      this.set("jsonifiedBuffer", JSON.stringify(b));
    } else {
      this.set("jsonifiedBuffer", "<No output>");
    }
  }),

  actions: {
    redraw() {
      this.get("jstreeActionReceiver").send("redraw");
    },

    destroy() {
      this.get("jstreeActionReceiver").send("destroy");
    },

    getNode(nodeId) {
      this.get("jstreeActionReceiver").send("getNode", nodeId);
    },

    handleGetNode(node) {
      if (node) {
        this.set("jstreeBuffer", node);
      }
    },

    contextMenuReportClicked(node) {
      this.set(
        "lastItemClicked",
        '"Report" item for node: <' + node.text + "> was clicked."
      );
    },

    addChildByText(nodeTextName) {
      if (typeof nodeTextName !== "string") {
        return;
      }

      var data = this.get("data");
      data.forEach(function(node, index) {
        if (typeof node === "object" && node["text"] === nodeTextName) {
          data[index].children.push("added child");
        }
      });
      this.set("data", data);
      this.send("redraw");
    },

    handleTreeDidBecomeReady() {
      this.set("treeReady", true);
    }
  }
});
