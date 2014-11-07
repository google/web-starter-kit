'use strict';

window.addEventListener('load', function() {
  var supportsClassList = ('classList' in document.createElement('a'));
  // Gracefully degrade in browsers without classList (no ripples).
  if (supportsClassList) {
    var itemElementsWithRipples =
        document.querySelectorAll('.PaperItem.RippleEffect');
    for (var i = 0; i < itemElementsWithRipples.length; i++) {
      var rippleContainer = document.createElement('span');
      rippleContainer.classList.add('PaperItem-rippleContainer');
      var ripple = document.createElement('span');
      ripple.classList.add('Ripple');
      rippleContainer.appendChild(ripple);
      itemElementsWithRipples[i].appendChild(rippleContainer);
    }
  }
});
