# ember-cli-jstree

Brings [jsTree](http://www.jstree.com/) functionality into your Ember app.

*Works with ember-cli <= 0.2.1.*

## Installation

Ember CLI addons can be installed with `npm`

	ember install:addon ember-cli-jstree

## Usage

Out of the box, the bare minimum you need on the template is `data`.
Run supported actions on the tree by registering it to your controller with the `actionReceiver` property.

````Handlebars
<div class="sample-tree">
    {{ember-jstree
        actionReceiver=jstreeActionReceiver
        selectedNodes=jstreeSelectedNodes
        data=data
        plugins=plugins
        themes=themes
        checkboxOptions=checkboxOptions
        contextmenuOptions=contextmenuOptions
        stateOptions=stateOptions
        typesOptions=typesOptions
        contextMenuReportClicked="contextMenuReportClicked"
        eventDidBecomeReady="handleTreeDidBecomeReady"
    }}
</div>
````

## Event Handling

The addon listens for events from jstree and sends them back to you using actions bound
to the Handlebars template. Simply set the property to the string name of the action
in your controller.

````Handlebars
{{ember-jstree
    [...]
    eventDidChange="handleJstreeEventDidChange"
    treeObject="jstreeObject"
}}
````

### Supported events

The following events have basic support included. More are on the way.

| jsTree Event   | Ember Action        |
|----------------|---------------------|
| changed.jstree | eventDidChange      |
| init.jstree    | eventDidInit        |
| ready.jstree   | eventDidBecomeReady |
| redraw.jstree  | eventDidRedraw      |

**Note:** In the meantime, you can add event listeners yourself by calling them on a mapped `treeObject` property.

````Javascript
_handleOpenNode: function() {
    var treeObject = this.get('jstreeObject');
    treeObject.on('open_node.jstree', function(e, data) {
        console.info('A node was opened.');
        console.log(data);
    }.bind(this));
}
````

### Selected nodes

Selected nodes are always available through the `selectedNodes` property

## Plugins

Plugins for your tree should be specified by a `plugins` string property. Multiple plugins should be
separated with commas.

````Handlebars
{{ember-jstree
    data=data
    plugins=plugins
}}
````

The following [plugins](http://www.jstree.com/plugins/) are currently supported. More on the way!

* Checkbox
* Contextmenu
* State
* Types
* Wholerow

### Configuring plugins

Send a hash containing the jsTree options through to the addon through the `<plugin name>Options` key.

In your **controller**:

````Javascript
jstreeStateOptionHash: {
    'key': 'ember-cli-jstree-dummy'
},
plugins: 'state'
````

In **Handlebars**:

````Handlebars
{{ember-jstree
    [...]
    plugins=plugins
    stateOptions=jstreeStateOptionHash
}}
````

## Sending actions to jsTree

The addon component will try to register an `actionReceiver` (see view helper example) to a property in
your controller if you define it. You can then send actions through that bound property:

````Javascript
this.get('jstreeActionReceiver').send('redraw');
````

**Note:** Action names in Ember are camelized (e.g.: `get_node()` in jsTree is mapped to `getNode()` in Ember).

If the corresponding jsTree method has a return value, the addon will send an action with the name corresponding
to supported actions in the table below. Because the addon actually calls these jsTree events, if any events
occur because of an action, they will be sent as actions (see Event Handling above).

### Supported actions

| jsTree Action     | Ember Action      | Return Action         |
|-------------------|-------------------|-----------------------|
| close_all         | closeAll          |                       |
| close_node        | closeNode         |                       |
| create_node       | createNode        | actionCreateNode      |
| delete_node       | deleteNode        | actionDeleteNode      |
| destroy           | destroy           |                       |
| get_children_dom  | getChildrenDom    | actionGetChildrenDom  |
| get_container     | getContainer      | actionGetContainer    |
| get_node          | getNode           | actionGetNode         |
| get_parent        | getParent         | actionGetParent       |
| get_path          | getPath           | actionGetPath         |
| last_error        | lastError         | actionLastError       |
| load_all          | loadAll           | actionLoadAll         |
| load_node         | loadNode          | actionLoadNode        |
| open_all          | openAll           |                       |
| open_node         | openNode          |                       |
| redraw            | redraw            |                       |
| rename_node       | renameNode        | actionRenameNode      |
| toggle_node       | toggleNode        |                       |

### Receiving return values

In your Handlebars component, map the return action (as above, most of which follow the pattern `action<action name>`):

````Handlebars
{{ember-jstree
    [...]
    actionGetNode="handleJstreeGetNode"
}}
````

Any params that jsTree returns will be given in the order specified by its API.

````Javascript
actionGetNode: function (node) {
    this.set('someValue', node);
}
````

## Demo

Both dynamic (AJAX loaded) and static examples are in the dummy demo.

* Clone this repo: `git clone`
* Install packages: `npm install` then `bower install`
* Run `ember serve`
* Visit the sample app at http://localhost:4200.

