document.addEventListener("DOMContentLoaded", function(){
	var personTmpl = document.getElementById("person");
	var controlTmpl = document.getElementById("controls");
	
	var personBindings = {
		".first-name" : "firstName",
		".last-name" : "lastName"
	};
	var personModel = {
		firstName : "Peter",
		lastName : "Parker"
	};
	
	var controlBindings = {
	  "#text" : "text",
	  "#button" : "button",
	  "#select" : "select",
	  "#checkbox" : "checkbox"
	};
	var controlModel = {
	  text : "lorem ipsum 1",
	  button : "push me",
	  select : "B",
	  checkbox : false
	};
	
	var markup = Tmpl.tmpl(personTmpl, personBindings, personModel);
	document.body.appendChild(markup);
	
	var markup2 = Tmpl.tmpl(controlTmpl, controlBindings, controlModel);
	document.body.appendChild(markup2);
	
	setTimeout(function(){
		personModel.firstName = "Spider";
		personModel.lastName = "Man";
		
		controlModel.text = "lorem ipsum 2";
		controlModel.button = "push me 2";
		controlModel.select = "C";
		controlModel.checkbox = true;
	}, 3000);
}, true);