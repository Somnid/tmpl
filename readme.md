Tmpl
====

Tmpl uses Object.observe and HTML native templates to create a very light-weight templating solution that features one-way binding.  It's also programmatic so you aren't polluting your markup with garbage.

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