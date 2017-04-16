(function(){
  window.addEventListener('load', function(){
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
  });
})();
