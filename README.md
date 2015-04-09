# ember-cli-jstree

Brings [jsTree](http://www.jstree.com/) functionality into your Ember app.

## Installation

Ember CLI addons can be installed with `npm`

	npm install ember-cli-jstree

## Usage

Out of the box, the bare minimum you need on the template is `data`.
Run supported actions on the tree by registering it to your controller with the `registerJstreeComponent` property.

````Handlebars
<div class="sample-tree">
    {{ember-jstree
        registerJstreeComponent="jstreeComponent"
        data=data
        plugins=plugins
        themes=themes
        checkboxOptions=checkboxOptions
        typesOptions=typesOptions
        contextmenuOptions=contextmenuOptions
        selectionDidChange="handleTreeSelectionChange"
        editItemContextmenuAction="editItemContextmenuAction"
        treeDidBecomeReady="treeBecameReady"
    }}
</div>
````

## Plugins

Plugins for your tree should be specified by a `plugins` string property. Multiple plugins should be
separated with commas.

	{
		"plugins": "checkbox, wholerow"
	}

The following [plugins](http://www.jstree.com/plugins/) are currently supported. More on the way!

* Checkbox
* Contextmenu
* State
* Types
* Wholerow

## Demo

* Run `ember serve`
* Visit your app at http://localhost:4200.

