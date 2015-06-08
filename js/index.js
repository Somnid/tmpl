document.addEventListener("DOMContentLoaded", function(){
	var personTmpl = document.getElementById("person");
	var controlTmpl = document.getElementById("controls");
	var attributesTmpl = document.getElementById("attributes");
	var styleTmpl = document.getElementById("style");
	var existing = document.getElementById("existing");
	
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
	
	var attributeBindings = {
	  ".link!href" : "link",
	  ".link" : "link"
	};
	var attributeModel = {
	  link : "http://www.google.com"
	};
	
	var styleBindings = {
	  "div$background-color" : "color",
	};
	var styleModel = {
	  color : "#000"
	};
	
	var existBindings = {
	  "label" : "message"
	};
	var existModel = {
	  "message" : "I exist"
	};
	
	var markup = Tmpl.tmpl(personTmpl, personBindings, personModel);
	document.body.appendChild(markup);
	
	var markup2 = Tmpl.tmpl(controlTmpl, controlBindings, controlModel);
	document.body.appendChild(markup2);
	
	var markup3 = Tmpl.tmpl(attributesTmpl, attributeBindings, attributeModel);
	document.body.appendChild(markup3);
	
	var markup4 = Tmpl.tmpl(styleTmpl, styleBindings, styleModel);
	document.body.appendChild(markup4);
	
	Tmpl.tmpl(existing, existBindings, existModel);
	
	setTimeout(function(){
		personModel.firstName = "Spider";
		personModel.lastName = "Man";
		
		controlModel.text = "lorem ipsum 2";
		controlModel.button = "push me 2";
		controlModel.select = "C";
		controlModel.checkbox = true;
		
		attributeModel.link = "http://www.bing.com";
		
		styleModel.color = "#f00";
		
		existModel.message = "...and I change";
	}, 3000);
}, true);