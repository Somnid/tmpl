var Tmpl = (function(){

    var tagSymbol = Symbol("tag");

    function tmpl(templateElement, bindings, data){
      var tmplData = {};
      tmplData.model = {
        templateElement : templateElement,
        bindings : bindings,
        data : data
      };
      bind(tmplData);
      tmplData.init();

      return tmplData.model.docFrag;
    }
    
    function tmplList(templateElement, bindings, data){
      var tmplData = {};
      tmplData.model = {
        templateElement : templateElement,
        bindings : bindings,
        data : data
      };
      bindList(tmplData);
      tmplData.initList();
      
      return tmplData.model.docFrag;
    }
    
    function bind(tmplData){
      tmplData.attachObserver = attachObserver.bind(tmplData);
      tmplData.setBindings = setBindings.bind(tmplData);
      tmplData.objectChanged = objectChanged.bind(tmplData);
      tmplData.propChanged = propChanged.bind(tmplData);
      tmplData.setInputHandlers = setInputHandlers.bind(tmplData);
      tmplData.updateBinding = updateBinding.bind(tmplData);
      tmplData.init = init.bind(tmplData);
    }
    
    function bindList(tmplData){
      tmplData.attachListObservers = attachListObservers.bind(tmplData);
      tmplData.arrayChanged = arrayChanged.bind(tmplData);
      tmplData.arrayPropChanged = arrayPropChanged.bind(tmplData);
      tmplData.remove = remove.bind(tmplData);
      tmplData.onParentMutation = onParentMutation.bind(tmplData);
      tmplData.attachParentObserver = attachParentObserver.bind(tmplData);
      tmplData.initList = initList.bind(tmplData);
    }
    
    function init(){
      this.model.docFrag = getTemplate(this.model.templateElement);
      this.model.elements = getDocfragChildList(this.model.docFrag);
      tagElements(this.model.elements, this.model.data);
      this.attachObserver();
      this.setBindings();
    }
    
    function initList(){
      this.model.docFrag = document.createDocumentFragment();
      this.model.elements = [];
      
      if(!Array.isArray(this.model.data)){
        throw "Cannot use tmplList on a non-array";
      }
      
      for(var i = 0; i < this.model.data.length; i++){
        var itemFrag = tmpl(this.model.templateElement, this.model.bindings, this.model.data[i]);
        var childElements = getDocfragChildList(itemFrag);
        this.model.elements = this.model.elements.concat(childElements);
        this.model.docFrag.appendChild(itemFrag);
      }
      
      this.parentObserver = new MutationObserver(this.onParentMutation);
      this.model.parent = this.model.docFrag;
      this.attachListObservers();
    }
    
    function onParentMutation(mutationRecord){
      var removedElementNodes = arrayWhere(mutationRecord[0].removedNodes, function(node){
        return node instanceof HTMLElement;
      });
      if(removedElementNodes.length == this.model.elements.length){ //assumed to be stamping docfrag
        this.model.parent = this.model.elements[0].parentElement;
        this.parentObserver.disconnect();
        this.attachParentObserver();
      }
    }
    
    function getTemplate(templateElement){
      if(templateElement.tagName == "TEMPLATE"){
          return document.importNode(templateElement.content, true);
        }
        return templateElement;
    }
    
    function attachObserver(){
      Object.observe(this.model.data, this.objectChanged);
    }
    
    function attachListObservers(){
      Object.observe(this.model.data, this.arrayChanged);
      this.attachParentObserver();
    }
    
    function attachParentObserver(){
      this.parentObserver.observe(this.model.parent, {
        childList : true,
        attributes : false,
        characterData : false,
        subtree : false,
      });
    }
    
    function setBindings(){
      for(var key in this.model.bindings){
        this.updateBinding(key, this.model.data);
        this.setInputHandlers(key, this.model.data);
      }
    }

    function objectChanged(changes){
      changes.forEach(this.propChanged);
    }
    
    function arrayChanged(changes){
      changes.forEach(this.arrayPropChanged);
    }
    
    function propChanged(change){
      for(var key in this.model.bindings){
        this.updateBinding(key, change.object, change.name);
      }
    }
    
    function arrayPropChanged(change){
      if(change.type == "delete" && isNumber(change.name)){
        this.remove(change.oldValue);
      }else if(change.type == "add" && isNumber(change.name)){
        var docFrag = tmpl(this.model.templateElement, this.model.bindings, change.object[change.name]);
        this.model.elements = this.model.elements.concat(getDocfragChildList(docFrag));
        this.model.parent.appendChild(docFrag);
      }
    }
    
    function updateBinding(bindKey, data, changedProp){
      var key = getDeepKey(bindKey);
      var accessor = this.model.bindings[bindKey];
      var matchingElements = queryElementsInList(this.model.elements, key.selector);
      
	    if(matchingElements.length === 0){
		    console.error("element: " + key.selector + " did not exist in scope.");
		    return;
	    }
      
      if(!changedProp || getFirstLevelProp(accessor) == changedProp){
        var value = traverseObjectProps(data, accessor);
        if(key.attribute){
          setElementAttributes(matchingElements, key.attribute, value);
        }else if(key.style){
          setElementStyles(matchingElements, key.style, value);
        }else if(key.class){
          setElementClasses(matchingElements, key.class, value);
        }else if(key.html){
          setElementHtml(matchingElements, value);
        }else{
          setElementValues(matchingElements, value);
        }
      }
    }
    
    function setInputHandlers(bindKey, data){
      var key = getDeepKey(bindKey);
      if(key.doubleBind){
        var matchingElements = queryElementsInList(this.model.elements, key.selector);
        for(var i = 0; i < matchingElements.length; i++){
          reverseBind(matchingElements[i], this.model.bindings[bindKey], data);
        }
      }
    }
    
    function remove(associatedItem){
	    var associatedElements = arrayWhere(this.model.elements, function(element){
	      return element[tagSymbol] == associatedItem[tagSymbol];
	    });
	    for(var i = 0; i < associatedElements.length; i++){
	      this.model.elements = arrayRemoveWhere(this.model.elements, function(element){
	        return element == associatedElements[i];
	      });
        removeElement(associatedElements[i]);
	    }
	  }

    function reverseBind(element, bindValue, data){
      if(element.tagName == "INPUT" || element.tagName == "TEXTAREA"){
        if(element.type.toUpperCase() == "CHECKBOX"){
          element.addEventListener("change", function(){
            setObjectProp(data, bindValue, element.checked);
          });
        }else{
          element.addEventListener("input", function(){
            setObjectProp(data, bindValue, element.value);
          });
        }
      }if(element.tagName == "SELECT"){
        element.addEventListener("change", function(){
          setObjectProp(data, bindValue, element.value);
        }); 
      }
    }
    
    function getDeepKey(key){
      if(key.indexOf("!") != -1){
        var attrKeySplit = key.split("!");
        return {
          selector : attrKeySplit[0],
          attribute : attrKeySplit[1]
        };
      }
      
      var styleRegEx = /\$[^=].*$/; //need to filter out $= which is valid in css 
      var styleKey = getDeepKeyPart(key, styleRegEx, "style");
      if(styleKey){
        return styleKey;
      }
      
      var classRegEx = /\^[^=].*$/; //need to filter out $= which is valid in css 
      var classKey = getDeepKeyPart(key, classRegEx, "class");
      if(classKey){
        return classKey;
      }
      
      var htmlRegEx = /->$/;
      var htmlKey = htmlRegEx.test(key);
      if(htmlKey){
        return {
          selector : key.replace(htmlRegEx, ""),
          html : true
        };
      }
      var doubleBindRegEx = /^<-/;
      var doubleBindKey = doubleBindRegEx.test(key);
      if(doubleBindKey){
        return {
          selector : key.substr(2),
          doubleBind : true
        };
      }
      
      return {
          selector : key
      };
    }
    
    function getDeepKeyPart(key, regEx, componentName){
      var match = regEx.exec(key);
      var componentKey = match ? match[0].substr(1) : null;
      
      if(componentKey){
        var componentSelect = key.replace(regEx, "");
        var keyObject = {
          selector : componentSelect,
        };
        keyObject[componentName] = componentKey;
        return keyObject;
      }
      return null;
    }
    
    function setElementValues(elements, value){
      for(var i = 0; i < elements.length; i++){
        setValue(elements[i], value);
      }
    }
    
    function setElementAttributes(elements, attributeKey, value){
      for(var i = 0; i < elements.length; i++){
        setAttribute(elements[i], attributeKey, value);
      }
    }
    
    function setElementStyles(elements, styleKey, value){
      for(var i = 0; i < elements.length; i++){
        setStyle(elements[i], styleKey, value);
      }
    }
    
    function setElementClasses(elements, classKey, value){
      for(var i = 0; i < elements.length; i++){
        setClass(elements[i], classKey, value);
      }
    }
    
    function setElementHtml(elements, value){
      for(var i = 0; i < elements.length; i++){
        setHtml(elements[i], value);
      }
    }
    
    function setValue(element, value){
      var elementType =  element.tagName.toUpperCase();

      if(elementType == "INPUT" || elementType == "SELECT" || elementType == "TEXTAREA"){
        if(element.type.toUpperCase() == "CHECKBOX"){
          element.checked = value;
        }else{
          element.value = value;
        }
      }else{
        element.textContent = value;
      }
    }
    
    function setAttribute(element, attributeKey, value){
      element.setAttribute(attributeKey, value);
    }
    
    function setStyle(element, styleKey, value){
      element.style[styleKey] = value;
    }
    
    function setClass(element, classKey, value){
      element.classList.toggle(classKey, !!value);
    }
    
    function setHtml(element, value){
      element.innerHTML = value;
    }

    function traverseObjectProps(obj, accessor){
      var keys = accessor.split(".");
      var prop = obj;
      for(var i = 0; i < keys.length; i++){
        if(keys[i] !== undefined){
			    if(prop[keys[i]] !== undefined){
				    prop = prop[keys[i]];
			    }else{
				    return null;
			    }
        }
      }
      return prop;
    }
    
    function setObjectProp(obj, accessor, value){
      var keys = accessor.split(".");
      var prop = obj;
      for(var i = 0; i < keys.length-1; i++){
        if(keys[i] !== undefined){
			    if(prop[keys[i]] !== undefined){
				    prop = prop[keys[i]];
			    }else{
				    console.error("Could not find property:", obj, accessor);
			    }
        }
      }
      if(prop[keys[keys.length-1]] !== undefined){
        prop[keys[keys.length-1]] = value;
      }else{
        console.error("Could not find property:", obj, accessor);
      }
    }

    function getFirstLevelProp(accessor){
      return accessor.split(".")[0];
    }

    function queryElementsInList(elements, selector){
      var matchingElements = [];
      for(var i = 0; i < elements.length; i++){
        var foundElements = elements[i].parentNode.querySelectorAll(selector); //need parent because this can include self
        if(foundElements.length > 0){
          for(var j = 0; j < foundElements.length; j++){
            if(isAncestorOrSelf(elements[i], foundElements[j])){ //check that we didn't find on some unrelated branch off parent
              matchingElements.push(foundElements[j]);
            }
          }
        }
      }
      return matchingElements;
    }

    function isAncestorOrSelf(thisNode, nodeToTest){
      while(thisNode != nodeToTest){
        if(nodeToTest.parentNode){
          nodeToTest = nodeToTest.parentNode;
        }else{
          return false;
        }
      }
      return true;
    }

    function getDocfragChildList(docfrag){
      var list = [];
      for(var i = 0; i < docfrag.children.length; i++){
        list.push(docfrag.children[i]);
      }
      return list;
    }
    
    function tagElements(elements, data){
      for(var i = 0; i < elements.length; i++){
        var id = listId.next().value;
        elements[i][tagSymbol] = id;
        data[tagSymbol] = id;
      }
    }
    
    function removeElement(element){
      element.parentNode.removeChild(element);
    }
    
    function arrayFirst(array, whereFunction){
		  for(var i = 0; i < array.length; i++){
			  if(whereFunction(array[i])){
				  return array[i];
			  }
		  }
		  return null;
	  }
	  
	  function arrayWhere(array, whereFunction){
		  var resultArray = [];
		  for(var i = 0; i < array.length; i++){
			  if(whereFunction(array[i])){
				  resultArray.push(array[i]);
			  }
		  }
		  return resultArray;
	  }
	  
	  function arrayRemoveWhere(array, whereFunction){
		  var remaining = [];
	
		  for (var i = 0; i < array.length; i++) {
			  if (!whereFunction(array[i])){
				  remaining.push(array[i]);
			  }
		  }
	
		  return remaining;
	  }
	  
	  function isNumber(str){
      if(str === null || str === ""){
        return false;
      }
      return !isNaN(str);
    }
    
    var listId = (function*(){
      var index = 0;
      while(true)
        yield index++;
    })();

    return {
        tmpl : tmpl,
        tmplList : tmplList
    };

})();