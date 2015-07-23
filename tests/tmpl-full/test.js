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

QUnit.test("changes model on text input", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><input type='text' class='input' /></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    "<-.input" : "value"
  };
  var testModel = {
    value : "Hello World"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var input = element.querySelector(".input");
  input.value = "Lorem Ipsum";
  TestUtil.fireEvent(input, "input");
	assert.equal(testModel.value, "Lorem Ipsum", "changed model on input");
});

QUnit.test("changes model on text input for textarea", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><textarea class='input'></textarea></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    "<-.input" : "value"
  };
  var testModel = {
    value : "Hello World"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var input = element.querySelector(".input");
  input.value = "Lorem Ipsum";
  TestUtil.fireEvent(input, "input");
	assert.equal(testModel.value, "Lorem Ipsum", "changed model on input");
});

QUnit.test("changes model on check change", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><input type='checkbox' class='input' /></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    "<-.input" : "value"
  };
  var testModel = {
    value : false
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var input = element.querySelector(".input");
  input.checked = true;
  TestUtil.fireEvent(input, "change");
	assert.equal(testModel.value, true, "changed model on change");
});
QUnit.test("changes model on select change", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><select class='input'><option value='a'>A</option><option value='b'>B</option></select></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    "<-.input" : "value"
  };
  var testModel = {
    value : "a"
  };
  var element = Tmpl.tmpl(testMarkup, testBindings, testModel);
  var input = element.querySelector(".input");
  input.value = "b";
  TestUtil.fireEvent(input, "change");
	assert.equal(testModel.value, "b", "changed model on change");
});

//Tmpl-Full extended functionality
QUnit.module(".tmplList");
QUnit.test("templates list immediately", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><span></span></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    "span" : "value"
  };
  var testModel = [
    {
      value : "hello world"
    },
    {
      value : "Lorem Ipsum"
    }
  ];
  var element = Tmpl.tmplList(testMarkup, testBindings, testModel);
  var spans = element.querySelectorAll("span");
  assert.equal(spans.length, 2, "templated 2 items");
  assert.equal(spans[0].textContent, "hello world", "templated 1");
	assert.equal(spans[1].textContent, "Lorem Ipsum", "templated 2");
});

QUnit.test("removes from list if array element is removed", function(assert){
  var fixture = document.querySelector("#qunit-fixture");
  fixture.innerHTML = "<template id='test'><span></span></template>";
  var testMarkup = document.querySelector("#test");
  var testBindings = {
    "span" : "value"
  };
  var testModel = [
    {
      value : "hello world"
    },
    {
      value : "Lorem Ipsum"
    }
  ];
  var element = Tmpl.tmplList(testMarkup, testBindings, testModel);
  var spans = element.querySelectorAll("span");
  assert.equal(spans.length, 2, "templated 2 items");
  testModel.pop();
  var done = assert.async();
  
  window.setTimeout(function(){
    spans = element.querySelectorAll("span");
    assert.equal(spans.length, 1, "removed 1 item");
    assert.equal(spans[0].textContent, "hello world", "still has non-removed item");
    done();
  }, 0);
});