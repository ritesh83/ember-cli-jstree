# ember-cli-jstree

Brings [jsTree](http://www.jstree.com/) functionality into your Ember app.

## Installation

Ember CLI addons can be installed with `npm`

	npm install ember-cli-jstree

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
}}

### Supported events

The following events have basic support included. More are on the way.

| jsTree Event   | Ember Action        |
|----------------|---------------------|
| changed.jstree | eventDidChange      |
| init.jstree    | eventDidInit        |
| ready.jstree   | eventDidBecomeReady |
| redraw.jstree  | eventDidRedraw      |

### Selected nodes

Selected nodes are always available through the `selectedNodes` property

## Plugins

Plugins for your tree should be specified by a `plugins` string property. Multiple plugins should be
separated with commas.

````Javascript
export default Ember.Controller.extend({
	"plugins": "checkbox, wholerow"
});
````

Don't forget to include this as part of the helper:

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

| jsTree Action     | Ember Action      | Return Action      |
|-------------------|-------------------|--------------------|
| destroy           | destroy           |                    |
| get_container     | getContainer      | actionGetContainer |
| get_node(id)      | getNode(id)       | actionGetNode      |
| get_parent(obj)   | getParent(obj)    | actionGetParent    |
| redraw            | redraw            |                    |

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

