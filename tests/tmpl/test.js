sinon.config.useFakeTimers = false;

QUnit.module(".tmpl");
QUnit.test("templates a template immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><span class='label'></span></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    ".label" : "message"
  };
  var testModel = {
    message : "Peter Parker"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var value = element.querySelector(".label").textContent;
	assert.equal(value, "Peter Parker", "templated textContent");
});

QUnit.test("changes a template on change", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><span class='label'></span></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    ".label" : "message"
  };
  var testModel = {
    message : "Peter Parker"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
	testModel.message = "Spiderman";
	var done = assert.async();
	
  window.setTimeout(function(){
    var value = element.querySelector(".label").textContent;
    assert.equal(value, "Spiderman", "changed textContent");
    done();
	}, 0);
});

QUnit.test("templates a text input immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><input class='input' /></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    ".input" : "message"
  };
  var testModel = {
    message : "Lorem Ipsum"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var value = element.querySelector(".input").value;
	assert.equal(value, "Lorem Ipsum", "templated value");
});

QUnit.test("templates a checkbox immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><input class='input' type='checkbox' /></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    ".input" : "value"
  };
  var testModel = {
    value : true
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var value = element.querySelector(".input").checked;
	assert.equal(value, true, "templated check");
});

QUnit.test("templates existing markup immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<div id='existing'><span class='label'></span></div>";
  var testMarkup = document.querySelector("#existing");
  var testBindings = {
    ".label" : "message"
  };
  var testModel = {
    message : "I exist!"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var value = element.querySelector(".label").textContent;
	assert.equal(value, "I exist!");
});

QUnit.test("changes existing markup on change", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<div id='existing'><span class='label'></span></div>";
  var testMarkup = document.querySelector("#existing");
  var testBindings = {
    ".label" : "message"
  };
  var testModel = {
    message : "I exist!"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
	testModel.message = "..and change!";
	var done = assert.async();
	
  window.setTimeout(function(){
    var value = element.querySelector(".label").textContent;
    assert.equal(value, "..and change!", "changed textContent");
    done();
	}, 0);
});

QUnit.test("templates attribute immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><a class='link'></a></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    ".link!href" : "value"
  };
  var testModel = {
    value : "http://www.google.com/"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var value = element.querySelector(".link").href;
	assert.equal(value, "http://www.google.com/", "set attribute");
});

QUnit.test("templates style immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><div class='rect'></div></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    ".rect$backgroundColor" : "value"
  };
  var testModel = {
    value : "#f00"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var value = element.querySelector(".rect").style.backgroundColor;
	assert.equal(value, "rgb(255, 0, 0)", "set style");
});

QUnit.test("adds class immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><div class='rect'></div></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    ".rect^hidden" : "value"
  };
  var testModel = {
    value : true
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var value = element.querySelector(".rect").classList.contains("hidden");
	assert.equal(value, true, "added class");
});

QUnit.test("removes class immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><div class='rect hidden'></div></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    ".rect^hidden" : "value"
  };
  var testModel = {
    value : false
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var value = element.querySelector(".rect").classList.contains("hidden");
	assert.equal(value, false, "removed class");
});

QUnit.test("sets html immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><div class='rect'></div></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    ".rect->" : "value"
  };
  var testModel = {
    value : "<span class='inner'>inner</span>"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var value = element.querySelector(".rect").querySelector(".inner").textContent;
	assert.equal(value, "inner", "added html");
});