var hasClass = function(el, cl){return el.className.match(new RegExp('(\\s|^)'+ cl +'(\\s|$)'))}
var addClass = function(el, cl){if (!hasClass(el,cl)) el.className += " "+cl;}
var removeClass = function(el, cl){if (hasClass(el,cl)){el.className=el.className.replace(new RegExp('(\\s|^)'+cl+'(\\s|$)'),' ');}}