document.addEventListener("DOMContentLoaded", function(){
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
	document.body.appendChild(markup);
	
	setTimeout(function(){
		personModel.firstName = "Spider";
		personModel.lastName = "Man";
	}, 5000);
}, true);