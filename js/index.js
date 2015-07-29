document.addEventListener("DOMContentLoaded", function(){
	var textTmpl = document.getElementById("person");
	var controlTmpl = document.getElementById("controls");
	var attributesTmpl = document.getElementById("attributes");
	var styleTmpl = document.getElementById("style");
	var existing = document.getElementById("existing");
	var doubleBindTmpl = document.getElementById("double-bind");
	var listTmpl = document.getElementById("list-tmpl");
	var eventTmpl = document.getElementById("event-tmpl");
	
	var textBindings = {
		".first-name" : "firstName",
		".last-name" : "lastName"
	};
	var textModel = {
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
	  ".label" : "message"
	};
	var existModel = {
	  "message" : "I exist"
	};
	
	var doubleBindBindings = {
	  "<-.bind-input" : "message",
	  "<-.bind-output" : "message",
	  "<-.check-bind-input" : "checked",
	  "<-.check-bind-output" : "checked",
	  "<-.select-bind-output" : "value",
	  "<-.select-bind-input" : "value"
	};
	var doubleBindModel = {
	  "message" : "Lorem Ipsum",
	  "checked" : false,
	  "value" : "A"
	};
	
	var listModel = [
	  {
	    "value" : 1
	  },
	  {
	    "value" : 2
	  }
	];
	var listBindings = {
    ".value" : "value"
	};
	
	var eventModel = {
	  "alert" : function(){ alert("pushed!");  }
	};
	var eventBindings = {
	  "{click}.btn" : "alert"
	};
	
	var markup = Tmpl.tmpl(textTmpl, textBindings, textModel);
	document.querySelector("#text-test").appendChild(markup);
	
	var markup2 = Tmpl.tmpl(controlTmpl, controlBindings, controlModel);
	document.querySelector("#controls-test").appendChild(markup2);
	
	var markup3 = Tmpl.tmpl(attributesTmpl, attributeBindings, attributeModel);
	document.querySelector("#attributes-test").appendChild(markup3);
	
	var markup4 = Tmpl.tmpl(styleTmpl, styleBindings, styleModel);
	document.querySelector("#style-test").appendChild(markup4);
	
	Tmpl.tmpl(existing, existBindings, existModel);
	
	var markup5 = Tmpl.tmpl(doubleBindTmpl, doubleBindBindings, doubleBindModel);
	document.querySelector("#double-bind-test").appendChild(markup5);
	
	var markup6 = Tmpl.tmplList(listTmpl, listBindings, listModel);
	document.querySelector("#list-test").appendChild(markup6);
	document.querySelector("#list-add").addEventListener("click", function(){
	  listModel.push({
	    "value" : id.next().value
	  });
	});
	document.querySelector("#list-remove").addEventListener("click", function(){
	  listModel.pop();
	});
	var id = (function*(){
    var index = 3;
    while(true)
      yield index++;
	})();
	
	var markup7 = Tmpl.tmpl(eventTmpl, eventBindings, eventModel);
	document.querySelector("#event-test").appendChild(markup7);
	
	setTimeout(function(){
		textModel.firstName = "Spider";
		textModel.lastName = "Man";
		
		controlModel.text = "lorem ipsum 2";
		controlModel.button = "push me 2";
		controlModel.select = "C";
		controlModel.checkbox = true;
		
		attributeModel.link = "http://www.bing.com";
		
		styleModel.color = "#f00";
		
		existModel.message = "...and I change";
	}, 3000);
}, true);