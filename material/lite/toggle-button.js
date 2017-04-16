var hasClass = function(el, cl){return el.className.match(new RegExp('(\\s|^)'+ cl +'(\\s|$)'))}
var addClass = function(el, cl){if (!hasClass(el,cl)) el.className += " "+cl;}
var removeClass = function(el, cl){if (hasClass(el,cl)){el.className=el.className.replace(new RegExp('(\\s|^)'+cl+'(\\s|$)'),' ');}}

var setListener = function (elm,events,callback) {
  var eventsArray = events.split(' '), i = eventsArray.length;
  while(i--){
    elm.addEventListener( eventsArray[i], callback, false );
  }
};

var removeListener = function (elm,events,callback) {
  var eventsArray = events.split(' '), i = eventsArray.length;
  while(i--){
    elm.removeEventListener( eventsArray[i], callback, false );
  }
};

window.addEventListener('load', function(){


  var toggles = document.getElementsByClassName('paper-toggle');

  for(var i = 0; i < toggles.length; i++){
    var toggle = toggles[i];
    var label = toggle.getElementsByTagName('label')[0];
    var checkbox = toggle.getElementsByTagName('input')[0];

    var marker = document.createElement('div');
    marker.className = 'marker';

    marker.addEventListener('click', function(e){
      if(!hasClass(marker, 'dragging')){
        checkbox.checked = !checkbox.checked;
      }
      removeClass(marker, 'dragging');
    });

    setListener(marker,'touchstart mousedown', function(e){
      var w = toggle.offsetWidth;
      var start = e.clientX;
      var r;
      var dragging = false;

      var dragMarker = function(e){
        dragging = true;
        addClass(marker, 'dragging');
        var dx = e.clientX - start;
        r = Math.min(46, Math.max(0, checkbox.checked ? 46 + dx : dx));
        marker.style.webkitTransform = marker.style.msTransform = marker.style.transform = 'translateX(' + r + 'px)';
      };

      setListener(window,'touchend mouseup', function(e){
        if(dragging){
          dragging = false;
          checkbox.checked = Math.abs(r) > 46 / 2;
        }
        marker.style.webkitTransform = marker.style.msTransform = marker.style.transform = null;

       removeListener(window,'touchmove mousemove', dragMarker);
      });

       setListener(window,'touchmove mousemove', dragMarker);
    });

    checkbox.addEventListener('click', function(e){
      removeClass(marker, 'dragging');
    })

    toggle.appendChild(marker);
  }


});
