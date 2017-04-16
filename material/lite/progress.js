var repeatCount = 3;
var autoStart = false;
var stepFraction = 120;
var start = null;

var requestAnimationFrame =
  window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function setRepeatCount(value) {
  repeat = value;
}

function setAutoStart(value) {
  autoStart = value;
}

function setProgressValue(progId, src) {
    var elem =
    document.getElementById(progId);
    elem.value = src.value;
}

function getProgressParams(elem) {
  var min = elem.min || 0;
  var max = elem.max || 1;
  var step = elem.step || ((max - min) / stepFraction);
  var maxRepeat = elem.maxRepeat || repeatCount;
  return {
    min: min,
    max: max,
    step: step,
    maxRepeat: maxRepeat
  }
}

function startProgress(button, progId) {
  if (button) {
    button.disabled = true;
  }
  if (progId) {
    var elem =
    document.getElementById(progId);
    elemProgress(elem, button);
  } else {
    var elems = document.getElementsByTagName('progress');
    for (var i = 0; i < elems.length; i++) {
      if (elems[i].value == 0) {
        elemProgress(elems[i], button);
      }
    }
  }
}

function elemProgress(elem, button) {
  var params = getProgressParams(elem);
  elem.value = params.min;
  elem.repeat = 0;
  nextProgress(elem, button);
}

function nextProgress(elem, button) {
  var params = getProgressParams(elem);
  elem.value += params.step;
  if (elem.value >= params.max) {
    if (params.maxRepeat && (++(elem.repeat) >= params.maxRepeat)) {
      if (button) {
        button.disabled = false;
      }
      elem.value = params.min;
      return;
    } else {
      elem.value = params.min;
    }
  }
  requestAnimationFrame(function() {
    nextProgress(elem, button)
  });
}

if (autoStart) {
  startProgress(null, null);
}
