
var wskSlider = function() {

  function moveKnob(knob, progress, slider, min, max, e) {
    var dx = Math.min(Math.max(e.clientX - min, 0), max);
    var s =  knob.style;
        s.transform = s.webkitTransform = 'translate3d(' + dx + 'px, 0, 0)';
    progress.style.width = dx + 'px';
    slider.setAttribute('value', dx / max);
    if (dx === 0) {
      knob.classList.add('ring');
    } else {
      knob.classList.remove('ring');
    }
  };

  function jumpKnob(knob, progress, slider, min, max, upHandler, e) {
    knob.classList.add('dragging');
    moveKnob(knob, progress, slider, min, max, e);
    window.addEventListener('mouseup', upHandler);  
  }

  function setupSlider(slider) {
    var knob = slider.querySelector('.sliderKnobInner');
    var progress = slider.querySelector('.progress.active');
    var min =  slider.getBoundingClientRect().left;
    var max =  slider.offsetWidth;
    var moveHandler = moveKnob.bind(this, knob, progress, slider, min, max);

    var upHandler = function(e) {
      knob.classList.remove('dragging');
      window.removeEventListener('mouseup', upHandler)
      window.removeEventListener('mousemove', moveHandler)
    };

    knob.addEventListener('mousedown', function(e) {
      e.target.classList.add('dragging');
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', upHandler);
    });

    var sliderBase = slider.querySelector('.progress.base');
    sliderBase.addEventListener('mousedown', jumpKnob.bind(
      this, knob, progress, slider, min, max, upHandler));
    var sliderActive = slider.querySelector('.progress.active');
    sliderActive.addEventListener('mousedown', jumpKnob.bind(
      this, knob, progress, slider, min, max, upHandler));
  };

  function findSliders() {
    var sliders =  document.getElementsByClassName('slider');
    var i = sliders.length;
    while (i--) {
      var slider = sliders[i];
      console.log(slider);
      setupSlider(slider);
    }
  };

  return {
    init: findSliders
  };

}();

wskSlider.init();




