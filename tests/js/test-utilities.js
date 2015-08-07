var TestUtil = (function(){
  function fireEvent(element,event){
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
  }
  
  return {
    fireEvent : fireEvent
  };
})();