# ember-cli-jstree

[![Travis-CI status](https://travis-ci.org/ritesh83/ember-cli-jstree.svg?branch=master)](https://travis-ci.org/ritesh83/ember-cli-jstree) [![Ember Observer Score](http://emberobserver.com/badges/ember-cli-jstree.svg)](http://emberobserver.com/addons/ember-cli-jstree)

Brings [jsTree](http://www.jstree.com/) functionality into your Ember app.

Demo: http://ritesh83.github.io/ember-cli-jstree/#/static

## Installation

Ember CLI addons can be installed with `ember install`

```
ember install ember-cli-jstree
```

## Usage

Out of the box, the bare minimum you need on the template is `data`.
Run supported actions on the tree by registering it to your controller with the `actionReceiver` property.

```Handlebars
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
        searchOptions=searchOptions
        searchTerm=searchTerm
        contextMenuReportClicked=(action "contextMenuReportClicked")
        eventDidBecomeReady=(action "handleTreeDidBecomeReady")
    }}
</div>
```

### Adding classes

As per the [jsTree JSON docs](https://www.jstree.com/docs/json/), you can add custom classes to both the `<li>` and `<a>` tags of each
individual node. These are passed on to jQuery's `attr` function.

For example, to add [hint.css](http://kushagragour.in/lab/hint/) tooltips, use the following in your JSON data hash.

```Javascript
{
	'id': 'node15',
	'text': 'Node title',
	'state': { 'selected': true },
	'a_attr': { 'class': 'hint--bottom', 'data-hint': 'Some hint goes here' }
}
```

This will get rendered in HTML as

```HTML
<a class="jstree-anchor jstree-clicked hint--bottom" href="#" tabindex="-1" data-hint="Some hint goes here" id="node15_anchor"><i class="jstree-icon jstree-themeicon" role="presentation"></i>Node title</a>
```

## Event Handling

The addon listens for events from jstree and sends them back to you using actions bound
to the Handlebars template. Simply set the property to the string name of the action
in your controller.

```Handlebars
{{ember-jstree
    [...]
    eventDidChange=(action "handleJstreeEventDidChange")
    treeObject=jstreeObject
}}
```

### Supported events

The following events have basic support included. More are on the way.

| jsTree Event            | Ember Action            |
| ----------------------- | ----------------------- |
| after_open.jstree       | eventDidOpen            |
| after_close.jstree      | eventDidClose           |
| changed.jstree          | eventDidChange          |
| dehover_node.jstree     | eventDidDehoverNode     |
| deselect_node.jstree    | eventDidDeselectNode    |
| hover_node.jstree       | eventDidHoverNode       |
| init.jstree             | eventDidInit            |
| loading.jstree          | eventIsLoading          |
| loaded.jstreee          | eventDidLoad            |
| ready.jstree            | eventDidBecomeReady     |
| redraw.jstree           | eventDidRedraw          |
| show_node.jstree        | eventDidShowNode        |
| select_node.jstree      | eventDidSelectNode      |
| (destroyed - no event)  | eventDidDestroy         |
| move_node.jstree        | eventDidMoveNode        |
| disable_checkbox.jstree | eventDidDisableCheckbox |
| enable_checkbox.jstree  | eventDidEnableCheckbox  |
| check_node.jstree       | eventDidCheckNode       |
| uncheck_node.jstree     | eventDidUncheckNode     |
| check_all.jstree        | eventDidCheckAll        |
| uncheck_all.jstree      | eventDidUncheckAll      |

**Note:** In the meantime, you can add event listeners yourself by calling them on a mapped `treeObject` property.

```Javascript
_handleOpenNode: function() {
    var treeObject = this.get('jstreeObject');
    treeObject.on('open_node.jstree', function(e, data) {
        console.info('A node was opened.');
        console.log(data);
    }.bind(this));
}
```

### Selected nodes

Selected nodes are always available through the `selectedNodes` property

## Plugins

Plugins for your tree should be specified by a `plugins` string property. Multiple plugins should be
separated with commas.

```Handlebars
{{ember-jstree
    data=data
    plugins=plugins
}}
```

The following [plugins](http://www.jstree.com/plugins/) are currently supported. More on the way!

* Checkbox
* Contextmenu
* Search
* State
* Types
* Wholerow
* Drag and Drop

### Configuring plugins

Send a hash containing the jsTree options through to the addon through the `<plugin name>Options` key.

In your **controller**:

```Javascript
jstreeStateOptionHash: {
    'key': 'ember-cli-jstree-dummy'
},
plugins: 'state'
```

In **Handlebars**:

```Handlebars
{{ember-jstree
    [...]
    plugins=plugins
    stateOptions=jstreeStateOptionHash
}}
```

### Configuring tree refresh

Send in the following [properties](<https://www.jstree.com/api/#/?f=refresh()>) to control how the tree is refreshed when you change the data

* skipLoading
* forgetState

Both default to false if nothing is passed in

## Sending actions to jsTree

The addon component will try to register an `actionReceiver` (see view helper example) to a property in
your controller if you define it. You can then send actions through that bound property:

```Javascript
this.get('jstreeActionReceiver').send('redraw');
```

**Note:** Action names in Ember are camelized (e.g.: `get_node()` in jsTree is mapped to `getNode()` in Ember).

If the corresponding jsTree method has a return value, the addon will send an action with the name corresponding
to supported actions in the table below. Because the addon actually calls these jsTree events, if any events
occur because of an action, they will be sent as actions (see Event Handling above).

### Supported actions

| jsTree Action    | Ember Action   | Return Action        |
| ---------------- | -------------- | -------------------- |
| copy_node        | copyNode       |                      |
| close_all        | closeAll       |                      |
| close_node       | closeNode      |                      |
| create_node      | createNode     | actionCreateNode     |
| delete_node      | deleteNode     | actionDeleteNode     |
| deselect_all     | deselectAll    |                      |
| deselect_node    | deselectNode   |                      |
| destroy          | destroy        |                      |
| get_children_dom | getChildrenDom | actionGetChildrenDom |
| get_container    | getContainer   | actionGetContainer   |
| get_node         | getNode        | actionGetNode        |
| get_parent       | getParent      | actionGetParent      |
| get_path         | getPath        | actionGetPath        |
| get_text         | getText        | actionGetText        |
| last_error       | lastError      | actionLastError      |
| load_all         | loadAll        | actionLoadAll        |
| load_node        | loadNode       | actionLoadNode       |
| move_node        | moveNode       |                      |
| open_all         | openAll        |                      |
| open_node        | openNode       |                      |
| redraw           | redraw         |                      |
| rename_node      | renameNode     | actionRenameNode     |
| select_all       | selectAll      |                      |
| select_node      | selectNode     |                      |
| toggle_node      | toggleNode     |                      |

### Receiving return values

In your Handlebars component, map the return action (as above, most of which follow the pattern `action<action name>`):

```Handlebars
{{ember-jstree
    [...]
    actionGetNode=(action "handleJstreeGetNode")
}}
```

Any params that jsTree returns will be given in the order specified by its API.

```Javascript
actionGetNode: function (node) {
    this.set('someValue', node);
}
```

## Demo

http://ritesh83.github.io/ember-cli-jstree/#/static

Both dynamic (AJAX loaded) and static examples are in the dummy demo.

* Clone this repo: `git clone`
* Install packages: `yarn`
* Run `ember serve`
* Visit the sample app at http://localhost:4200.

## Guides

http://ridhwana.com/blog/2017/introduction-to-ember-cli-js-tree/
