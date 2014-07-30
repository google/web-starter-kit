(function(){
  window.onload = function(){
    var hasClass = function(el, cl){return el.className.match(new RegExp('(\\s|^)'+ cl +'(\\s|$)'))}
    var addClass = function(el, cl){if (!hasClass(el,cl)) el.className += " "+cl;}
    var removeClass = function(el, cl){if (hasClass(el,cl)){el.className=el.className.replace(new RegExp('(\\s|^)'+cl+'(\\s|$)'),' ');}}
    
    var inputs = document.getElementsByClassName('text-input');

    for(var i = 0; i < inputs.length; i++){
      var input = inputs[i];
      
      input.addEventListener('keyup', function(e){
        if(this.value != ''){
          addClass(this, 'dirty')
        }else{
          removeClass(this, 'dirty')
        }
      });
    }
  };
})();