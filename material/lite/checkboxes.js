/*
 * Material Deesign Checkboxes non Polymer.
 * Tested and working in: IE9+, Chrome (Mobile + Desktop), Safari,
 * Opera, Firefox.
 * @author Jason Mayes 2014, www.jasonmayes.com
*/

var wskCheckbox = function() {
  var wskCheckboxes = [];

  function animateCircle(checkboxElement) {
    var circle =
        checkboxElement.parentNode.getElementsByClassName('wskCircle')[0];
    var restore = '';
    if (circle.className.indexOf('flipColor') < 0) {
      restore = circle.className + ' flipColor';
    } else {
      restore = 'wskCircle';
    }
    console.log(restore);
    circle.className = restore  + ' show';
    setTimeout(function(){
      circle.className = restore;
    }, 150);
  }

  function addEventHandler(elem, eventType, handler) {
    if (elem.addEventListener) {
      elem.addEventListener (eventType, handler, false);
    }
    else if (elem.attachEvent) {
      elem.attachEvent ('on' + eventType, handler);
    }
  }

  function clickHandler(e) {
    e.stopPropagation();
    if (this.className.indexOf('checked') < 0) {
      this.className += ' checked';
    } else {
      this.className = 'wskCheckbox';
    }
    animateCircle(this);
  }

  function clickHandlerLabel(e) {
    var id = this.getAttribute('for');
    var i = wskCheckboxes.length;
    while (i--) {
      if (wskCheckboxes[i].id === id) {
        if (wskCheckboxes[i].checkbox.className.indexOf('checked') < 0) {
          wskCheckboxes[i].checkbox.className += ' checked';
        } else {
          wskCheckboxes[i].checkbox.className = 'wskCheckbox';
        }
        animateCircle(wskCheckboxes[i].checkbox);
        break;
      }
    }
  }

  function findCheckBoxes() {
    var labels =  document.getElementsByTagName('label');
    var i = labels.length;
    while (i--) {
      var posCheckbox = document.getElementById(labels[i].getAttribute('for'));
      if (posCheckbox !== null && posCheckbox.type === 'checkbox') {
        var text = labels[i].innerText;
        var span = document.createElement('span');
        span.className = 'wskCheckbox';
        span.tabIndex = i;
        var span2 = document.createElement('span');
        span2.className = 'wskCircle flipColor';
        labels[i].insertBefore(span2, labels[i].firstChild);
        labels[i].insertBefore(span, labels[i].firstChild);
        addEventHandler(span, 'click', clickHandler);
        addEventHandler(labels[i], 'click', clickHandlerLabel);
        wskCheckboxes.push({'checkbox': span,
            'id': labels[i].getAttribute('for')});
      }
    }
  }

  return {
    init: findCheckBoxes
  };
}();
