'use strict';

function Slider(element) {
  // Browser feature detection.
  var isIE =
      window.navigator.msPointerEnabled || (document.all && !window.atob);

  var sliderElement = element;

  if (isIE) {
    // Since we need to specify a very large height in IE due to implementation
    // limitations, we add a parent here that trims it down to a reasonable
    // size.
    var containerIE = document.createElement('div');
    containerIE.className = 'Slider-IEContainer';
    sliderElement.parentElement.insertBefore(containerIE, sliderElement);
    sliderElement.parentElement.removeChild(sliderElement);
    containerIE.appendChild(sliderElement);
  } else {
    // For non-IE browsers, we need a div structure that sits behind the slider
    // and allows us to style the left and right sides of it with different
    // colors.
    var container = document.createElement('div');
    container.className = 'Slider-container';
    sliderElement.parentElement.insertBefore(container, sliderElement);
    sliderElement.parentElement.removeChild(sliderElement);
    container.appendChild(sliderElement);
    var backgroundFlex = document.createElement('div');
    backgroundFlex.className = 'Slider-backgroundFlex';
    container.appendChild(backgroundFlex);
    var backgroundLower = document.createElement('div');
    backgroundLower.className = 'Slider-backgroundLower';
    backgroundFlex.appendChild(backgroundLower);
    var backgroundUpper = document.createElement('div');
    backgroundUpper.className = 'Slider-backgroundUpper';
    backgroundFlex.appendChild(backgroundUpper);
  }

  sliderElement.addEventListener('input', function(e) {
    this.updateValue();
  }.bind(this));

  sliderElement.addEventListener('change', function(e) {
    this.updateValue();
  }.bind(this));

  sliderElement.addEventListener('mouseup', function(e) {
    e.target.blur();
  }.bind(this));

  this.updateValue = function() {
    if (!isIE) {
      // Calculate and apply percentages to div structure behind slider.
      var fraction = (sliderElement.value - sliderElement.min) /
          (sliderElement.max - sliderElement.min);

      if (fraction === 0) {
        sliderElement.classList.add('zero');
      } else {
        sliderElement.classList.remove('zero');
      }

      backgroundLower.style.flex = fraction;
      backgroundLower.style.webkitFlex = fraction;
      backgroundUpper.style.flex = 1 - fraction;
      backgroundUpper.style.webkitFlex = 1 - fraction;
    }
  };

  this.updateValue();
}

window.addEventListener('load', function() {
  var sliders =  document.querySelectorAll('input[type="range"]');
  for (var i = 0; i < sliders.length; i++) {
    new Slider(sliders[i]);
  }
});
