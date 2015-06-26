var Tmpl = (function(){

    function tmpl(templateElement, bindings, data){
        var docFrag;
        var elements;
        
        if(templateElement.tagName == "TEMPLATE"){
          docfrag = document.importNode(templateElement.content, true);
          
        }else{
          docfrag = templateElement;
        }
        elements = getDocfragChildList(docfrag);
        
        Object.observe(data, objectChanged.bind({
            elements : elements, //docfrags lose all their nodes when they append so track them directly
            bindings : bindings
        }));
        
        for(var key in bindings){
          updateBinding(key, bindings, elements, data);
        }
        return docfrag;
    }

    function objectChanged(changes){
        changes.forEach(propChanged.bind(this));
    }

    function propChanged(change){
      for(var key in this.bindings){
        updateBinding(key, this.bindings, this.elements, change.object, change.name);
      }
    }
    
    function updateBinding(bindKey, bindings, elements, data, changedProp){
      var key = getDeepKey(bindKey);
      var accessor = bindings[bindKey];
      var matchingElements = queryElementInList(elements, key.selector);
      
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

      if(elementType == "INPUT" || elementType == "SELECT"){
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

    function getFirstLevelProp(accessor){
      return accessor.split(".")[0];
    }

    function queryElementInList(elements, selector){
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

    return {
        tmpl : tmpl
    };

})();