/* This is a prototype */
var createSnackbar = (function() {
  // Any snackbar that is already shown
  var previous = null;

  return function(message, actionText, action) {
    if (previous) {
      previous.dismiss();
    }
    var snackbar = document.createElement('div');
    snackbar.className = 'paper-snackbar';
    snackbar.dismiss = function() {
      this.style.opacity = 0;
    };
    var text = document.createTextNode(message);
    snackbar.appendChild(text);
    if (actionText) {
      if (!action) {
        action = snackbar.dismiss.bind(snackbar);
      }
      var actionButton = document.createElement('button');
      actionButton.className = 'action';
      actionButton.innerHTML = actionText;
      actionButton.addEventListener('click', action);
      snackbar.appendChild(actionButton);
    }
    setTimeout(function() {
      if (previous === this) {
        previous.dismiss();
      }
    }.bind(snackbar), 5000);

    snackbar.addEventListener('transitionend', function(event, elapsed) {
      if (event.propertyName === 'opacity' && this.style.opacity == 0) {
        this.parentElement.removeChild(this);
        if (previous === this) {
          previous = null;
        }
      }
    }.bind(snackbar));

    previous = snackbar;
    document.body.appendChild(snackbar);
    // In order for the animations to trigger, I have to force the original style to be computed, and then change it.
    getComputedStyle(snackbar).bottom;
    snackbar.style.bottom = '0px';
    snackbar.style.opacity = 1;
  };
})();

var longMessage = "This is a longer message that won't fit on one line. It is, inevitably, quite a boring thing. Hopefully it is still useful.";
var shortMessage = 'Your message was sent';

window.addEventListener('load', function(){
  document.getElementById('single').addEventListener('click', function() {
    createSnackbar(shortMessage);
  });

  document.getElementById('multi').addEventListener('click', function() {
    createSnackbar(longMessage);
  });

  document.getElementById('singleaction').addEventListener('click', function() {
    createSnackbar(shortMessage, 'Dismiss');
  });

  document.getElementById('multiaction').addEventListener('click', function() {
    createSnackbar(longMessage, 'Wot?', function() { alert('Moo!'); });
  });

});


/* This stuff just for ripple effect for buttons. Not part of the Snackbar */

/*
var find = document.querySelectorAll.bind(document);
var buttons = find('.paper-button');

for(i=0; i < buttons.length; i++){
 var button = buttons[i];
    button.addEventListener('click', function(e) {

    var bound = this.getBoundingClientRect();
    var x = e.clientX - bound.left;
    var y = e.clientY - bound.top;

    var ripple = this.querySelector('.ripple');

    if (ripple) {
      TweenLite.set(ripple, {x: x, y: y, scaleX: 0, scaleY: 0, opacity: 1});

      TweenLite.to(ripple, 1.5, {scaleX: 1, scaleY: 1, opacity: 0, ease: Expo.easeOut});
    }
  });
}*/
