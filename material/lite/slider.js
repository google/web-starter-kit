
var wskSlider = function() {
  // TODO(devnook): Explore input type="range" implementation option.

  /**
   * @param {{knob: Element,
   *         progress: Element,
   *         slider: Element,
   *         min: number,
   *         max: number}} config Object describing the elements of the slider.
   */
  function moveKnob(config, e) {
    var dx = Math.min(Math.max(e.clientX - config.min, 0), config.max);
    var s =  config.knob.style;
        s.transform = s.webkitTransform = 'translate3d(' + dx + 'px, 0, 0)';
    config.progress.style.width = dx + 'px';
    config.slider.setAttribute('value', dx / config.max);
    config.knob.classList.toggle('ring', dx === 0);
  };

  function jumpKnob(config, upHandler, e) {
    config.knob.classList.add('dragging');
    moveKnob(config, e);
    window.addEventListener('mouseup', upHandler);
  }

  function setupSlider(slider) {
    var knob = slider.querySelector('.sliderKnobInner');
    var progress = slider.querySelector('.progress.active');
    var min = slider.getBoundingClientRect().left;
    var max = slider.offsetWidth;
    var moveHandler = moveKnob.bind(this, {'knob': knob,
                                           'progress': progress,
                                           'slider': slider,
                                           'min': min,
                                           'max': max});

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
      this, {'knob': knob,
             'progress': progress,
             'slider': slider,
             'min': min,
             'max': max}, upHandler));
    var sliderActive = slider.querySelector('.progress.active');
    sliderActive.addEventListener('mousedown', jumpKnob.bind(
      this, {'knob': knob,
             'progress': progress,
             'slider': slider,
             'min': min,
             'max': max}, upHandler));
  };

  function findSliders() {
    var sliders =  document.getElementsByClassName('slider');
    var i = sliders.length;
    while (i--) {
      var slider = sliders[i];
      setupSlider(slider);
    }
  };

  return {
    init: findSliders
  };

}();

wskSlider.init();
