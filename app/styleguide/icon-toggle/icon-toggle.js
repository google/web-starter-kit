window.addEventListener('load', function() {
  'use strict';

  var blurHandlerGenerator = function(element) {
    return function() {
      // TODO: figure out why there's a focus event being fired after our blur,
      // so that we can avoid this hack.
      window.setTimeout(function() { element.blur(); }, 0.001);
    };
  };

  var eventHandlerGenerator = function(checkbox, label) {
    return function(evt) {
      if (checkbox.checked) {
        label.classList.add('is-checked');
      } else {
        label.classList.remove('is-checked');
      }

      if (checkbox.disabled) {
        label.classList.add('is-disabled');
      } else {
        label.classList.remove('is-disabled');
      }

      if (evt && evt.type === 'focus') {
        label.classList.add('is-focused');
      }

      if (evt && evt.type === 'blur') {
        label.classList.remove('is-focused');
      }
    };
  };

  var labels =  document.querySelectorAll('.IconToggle-label');
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    var checkbox = document.getElementById(label.getAttribute('for'));
    if (checkbox) {
      var blurHandler = blurHandlerGenerator(checkbox);
      var eventHandler = eventHandlerGenerator(checkbox, label);
      checkbox.addEventListener('change', eventHandler);
      checkbox.addEventListener('blur', eventHandler);
      checkbox.addEventListener('focus', eventHandler);
      eventHandler();

      if (checkbox.classList.contains('RippleEffect')) {
        checkbox.classList.add('RippleEffect--recentering');
        label.classList.add('RippleEffect');
        label.classList.add('RippleEffect--recentering');
        var rippleContainer = document.createElement('span');
        rippleContainer.classList.add('IconToggle-rippleContainer');
        var ripple = document.createElement('span');
        ripple.classList.add('Ripple');
        rippleContainer.appendChild(ripple);
        ripple.addEventListener('mouseup', blurHandler);
        label.appendChild(rippleContainer);
      }

      label.addEventListener('mouseup', blurHandler);
      checkbox.addEventListener('mouseup', blurHandler);
    }
  }
});
