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
        jstreeDidBecomeReady="handleTreeDidBecomeReady"
    }}
</div>
````

## Event Handling

Events must be bound using the view helper.

### Supported events

The following events have basic support included. More are on the way

| jsTree Event   | Ember Action         |
|----------------|----------------------|
| ready.jstree   | jstreeDidBecomeReady |
| changed.jstree | jstreeDidChange      |

### Selected nodes

Selected nodes are always available through `selectedNodes`.

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
your controller if you define it. You can then send actions using:

````Javascript
this.get('jstreeActionReceiver').send('redraw');
````

### Supported actions

* redraw
* destroy

## Demo

Both dynamic (AJAX loaded) and static examples are in the dummy demo.

* Run `ember serve`
* Visit your app at http://localhost:4200.

