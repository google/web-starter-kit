'use strict';

function RadioButton(btnElement, labelElement) {
  var outerCircle = document.createElement('span');
  outerCircle.className = 'RadioButton-outerCircle';

  var innerCircle = document.createElement('span');
  innerCircle.className = 'RadioButton-innerCircle';

  labelElement.insertBefore(outerCircle, btnElement);
  labelElement.appendChild(innerCircle);

  var supportsClassList = ('classList' in document.createElement('a'));
  // Gracefully degrade in browsers without classList (no ripples).
  if (supportsClassList) {
    if (btnElement.classList.contains('RippleEffect')) {
      btnElement.classList.add('RippleEffect--recentering');
      var rippleContainer = document.createElement('span');
      rippleContainer.classList.add('RadioButton-rippleContainer');
      rippleContainer.classList.add('RippleEffect');
      rippleContainer.classList.add('RippleEffect--recentering');

      var ripple = document.createElement('span');
      ripple.classList.add('Ripple');

      rippleContainer.appendChild(ripple);
      labelElement.appendChild(rippleContainer);
    }
  }
}

window.addEventListener('load', function() {
  var radioLabels = document.querySelectorAll('.RadioButton-label');
  for (var i = 0; i < radioLabels.length; i++) {
    var radioButton = radioLabels[i].querySelector('.RadioButton');
    new RadioButton(radioButton, radioLabels[i]);
  }
});
