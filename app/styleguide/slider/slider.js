/**
 * Class constructor for Slider WSK component.
 * Implements WSK component design pattern defined at:
 * https://github.com/jasonmayes/wsk-component-design-pattern
 * @param {HTMLElement} element The element that will be upgraded.
 */
function MaterialSlider(element) {
  'use strict';

  this.element_ = element;
  // Browser feature detection.
  this.isIE_ = window.navigator.msPointerEnabled;
  // Initialize instance.
  this.init();
}

/**
 * Store constants in one place so they can be updated easily.
 * @enum {string | number}
 * @private
 */
MaterialSlider.prototype.Constant_ = {
  // None for now.
};

/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 * @enum {string}
 * @private
 */
MaterialSlider.prototype.CssClasses_ = {
  WSK_SLIDER_IE_CONTAINER: 'wsk-slider__ie-container',

  WSK_SLIDER_CONTAINER: 'wsk-slider__container',

  WSK_SLIDER_BACKGROUND_FLEX: 'wsk-slider__background-flex',

  WSK_SLIDER_BACKGROUND_LOW: 'wsk-slider__background-lower',

  WSK_SLIDER_BACKGROUND_UP: 'wsk-slider__background-upper',

  IS_LOWEST_VALUE: 'is-lowest-value'
};


/**
 * Handle input on element.
 * @param {Event} event The event that fired.
 * @private
 */
MaterialSlider.prototype.onInput_ = function(event) {
  'use strict';

  this.updateValue_();
};


/**
 * Handle change on element.
 * @param {Event} event The event that fired.
 * @private
 */
MaterialSlider.prototype.onChange_ = function(event) {
  'use strict';

  this.updateValue_();
};


/**
 * Handle mouseup on element.
 * @param {Event} event The event that fired.
 * @private
 */
MaterialSlider.prototype.onMouseUp_ = function(event) {
  'use strict';

   event.target.blur();
};


/**
 * Handle updating of values.
 * @param {Event} event The event that fired.
 * @private
 */
MaterialSlider.prototype.updateValue_ = function(event) {
  'use strict';

  // Calculate and apply percentages to div structure behind slider.
  var fraction = (this.element_.value - this.element_.min) /
      (this.element_.max - this.element_.min);

  if (fraction === 0) {
    this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
  } else {
    this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
  }

  if (!this.isIE_) {
    this.backgroundLower_.style.flex = fraction;
    this.backgroundLower_.style.webkitFlex = fraction;
    this.backgroundUpper_.style.flex = 1 - fraction;
    this.backgroundUpper_.style.webkitFlex = 1 - fraction;
  }
};


/**
 * Initialize element.
 */
MaterialSlider.prototype.init = function() {
  'use strict';

  if (this.element_) {
    if (this.isIE_) {
      // Since we need to specify a very large height in IE due to
      // implementation limitations, we add a parent here that trims it down to
      // a reasonable size.
      var containerIE = document.createElement('div');
      containerIE.classList.add(this.CssClasses_.WSK_SLIDER_IE_CONTAINER);
      this.element_.parentElement.insertBefore(containerIE, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      containerIE.appendChild(this.element_);
    } else {
      // For non-IE browsers, we need a div structure that sits behind the
      // slider and allows us to style the left and right sides of it with
      // different colors.
      var container = document.createElement('div');
      container.classList.add(this.CssClasses_.WSK_SLIDER_CONTAINER);
      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);
      var backgroundFlex = document.createElement('div');
      backgroundFlex.classList.add(this.CssClasses_.WSK_SLIDER_BACKGROUND_FLEX);
      container.appendChild(backgroundFlex);
      this.backgroundLower_ = document.createElement('div');
      this.backgroundLower_.classList.add(
          this.CssClasses_.WSK_SLIDER_BACKGROUND_LOW);
      backgroundFlex.appendChild(this.backgroundLower_);
      this.backgroundUpper_ = document.createElement('div');
      this.backgroundUpper_.classList.add(
          this.CssClasses_.WSK_SLIDER_BACKGROUND_UP);
      backgroundFlex.appendChild(this.backgroundUpper_);
    }

    this.element_.addEventListener('input', this.onInput_.bind(this));
    this.element_.addEventListener('change', this.onChange_.bind(this));
    this.element_.addEventListener('mouseup', this.onMouseUp_.bind(this));

    this.updateValue_();
  }
};


// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
  constructor: MaterialSlider,
  classAsString: 'MaterialSlider',
  cssClass: 'wsk-js-slider'
});
