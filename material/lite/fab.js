/* This is a prototype */

var find = document.querySelectorAll.bind(document);
var buttons = find('.paper-button');

for(i=0; i < buttons.length; i++){
 var button = buttons[i];
    button.addEventListener('click', function(e) {

    var bound = this.getBoundingClientRect();
    var x = e.clientX - bound.left;
    var y = e.clientY - bound.top;

    var ripple = this.querySelector('.ripple');

    TweenLite.set(ripple, {x: x, y: y, scaleX: 0, scaleY: 0, opacity: 1});

    TweenLite.to(ripple, 1.5, {scaleX: 1, scaleY: 1, opacity: 0, ease: Expo.easeOut});

  });
}
