var Tmpl = (function(){
 
    function tmpl(templateElement, bindings, data){
        var docfrag = document.importNode(templateElement.content, true);
        Object.observe(data, dataChanged.bind({
            elements : getDocfragChildList(docfrag), //docfrags lose all their nodes when they append so track them directly
            bindings : bindings
        }));
        for(var key in bindings){
            docfrag.querySelector(key).innerText = traverseObjectProps(data, bindings[key]);
        }
        return docfrag;
    }
     
    function dataChanged(changes){
        changes.forEach(propChanged.bind(this));
    }

    function propChanged(change){
        for(var key in this.bindings){
            var element = queryElementInList(this.elements, key)
            if(element && getFirstLevelProp(this.bindings[key]) == change.name){
              element.innerText = traverseObjectProps(change.object, this.bindings[key]);
            }
        }
    }
    
    function traverseObjectProps(obj, accessor){
      var keys = accessor.split(".");
      var prop = obj;
      for(var i = 0; i < keys.length; i++){
        if(keys[i]){
          prop = prop[keys[i]];
        }
      }
      return prop;
    }
    
    function getFirstLevelProp(accessor){
      return accessor.split(".")[0];
    }
    
    function queryElementInList(elements, selector){
      for(var i = 0; i < elements.length; i++){
        var el = elements[i].parentNode.querySelector(selector); //need parent because this can include self
        if(el && ancestorOrSelf(elements[i], el)){ //check that we didn't find on some unrelated branch off parent
          return el;
        }
      }
      return null;
    }
    
    function ancestorOrSelf(thisNode, nodeToTest){
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