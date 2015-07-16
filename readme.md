Tmpl
====

Tmpl uses Object.observe and HTML native templates to create a very light-weight templating solution that features two-way binding.  It's also programmatic so you aren't polluting your markup with garbage.

To use pass in your template element object, a hash of bindings with keys equal to an element selector off the template root and a value representing to the property you wish to bind to it's innerText (Note "object.property" notation is supported for deeper properties though the updates will only happen on the root object).  The 3rd argument is the object you are binding to.

Example
=======

Html
----

```
<template id="person">
	<span class="first-name"></span>
	<span class="last-name"></span>
</template>
```

Javascript
----------

```
var personTmpl = document.getElementById("person");
var personBindings = {
	".first-name" : "firstName",
	".last-name" : "lastName"
};
var personModel = {
	firstName : "Peter",
	lastName : "Parker"
};

var markup = Tmpl.tmpl(personTmpl, personBindings, personModel);
```

You can target attributes with "!":

```
var attributeBindings = {
	".link!href" : "link",
	".link" : "link"
};
```

The link's href with change to the model.link.

Because styles are so important in html there's a style binding as well "$":

```
var styleBindings = {
  "div$background-color" : "color",
};
```

This will change the background-color of div to the value of model.color.

Classes also get a binding "^":

```
var classBindings = {
  "div^hidden" : "value"
};
```

This will toggle the class based on the truthy value of mode.value

If you need to instead change the html end the selector with "->"

```
<template id="template">
  <div></div>
</template>

var htmlModel = {
  value : "<span>inner</span>"
};

var htmlBindings = {
  "div->" : "value"
};
```

This will fill the innerHTML with model.value. In this case it would create:

```
<div>
  <span>inner</span>
</div>
```

Two way binds start with "<-"

```
<template id="template">
  <input type=text />
</template>

var classBindings = {
  "<-input" : "value"
};
```

This works for inputs, textarea, checkboxs and selects and will bind the UI value to the model on change or input where applicable.
