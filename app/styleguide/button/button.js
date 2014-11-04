'use strict';

window.addEventListener('load', function() {
  var supportsClassList = ('classList' in document.createElement('a'));
  // Gracefully degrade in browsers without classList (no ripples).
  if (supportsClassList) {
    var buttomElementsWithRipples =
        document.querySelectorAll('.PaperButton.RippleEffect');
    for (var i = 0; i < buttomElementsWithRipples.length; i++) {
      var rippleContainer = document.createElement('span');
      rippleContainer.classList.add('PaperButton-rippleContainer');
      var ripple = document.createElement('span');
      ripple.classList.add('Ripple');
      rippleContainer.appendChild(ripple);
      buttomElementsWithRipples[i].appendChild(rippleContainer);
    }
  }
});
