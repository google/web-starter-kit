/* This is a prototype */
(function(){
  window.addEventListener('load', function(){
    var find = document.querySelectorAll.bind(document);

    /* Binds all menus to buttons */
    function bindMenusToButtons() {
      var menuButtons = find('.paper-menu-button');
      for (var j = 0; j < menuButtons.length; j++) {
        var menuButton = menuButtons[j];
        var menu = menuButton.querySelector('.paper-menu');
        var button = menuButton.querySelector('.paper-button');

        var onClickClosureFunction = function(menuClosure){
            return function(e) {
              // Add a click event on the body so that anywhere we click the menu closes.
              var clickEventListener = document.addEventListener('click', function(event) {
                  hideMenu();
              });
              // Add an ENTER key binding event so that the menu closes on this.
              var keydownEventListener = document.addEventListener('keydown', function(event) {
                  if(event.keyCode == '13') {
                    hideMenu();
                  }
              });
              // Add a TAB key binding event so that the menu closes when tabbing out of the menu.
              var keyupEventListener = document.addEventListener('keyup', function(event) {
                  if(event.keyCode == '9' && document.activeElement.parentNode != menuClosure) {
                    hideMenu();
                  }
              });
              var hideMenu = function() {
                menuClosure.classList.remove('visible');
                document.removeEventListener('keydown', keydownEventListener);
                document.removeEventListener('click', clickEventListener);
                document.removeEventListener('keyup', keyupEventListener);
              };
              // Defer making the menu visible until after the event finished propagating so that the click event on the body doens't interfere.
              if (!menuClosure.classList.contains('visible')) {
                setTimeout(function(){menuClosure.classList.add('visible');}, 0);
              }
            };
          }(menu);

        var buttonHammer = new Hammer(button);
        buttonHammer.on('tap', onClickClosureFunction);

        // Some Styling that needs to be dynamic.
        if (menu.classList.contains('top')) {
          menu.style.top = '-' + menu.offsetHeight + 'px';
        }
      }
    }

     /* Bin all Menus to buttons at startup */
    bindMenusToButtons();

    /* Code for the ripple effect. Modified from Addy's code to support all elements instead of just button and use Hammer for better event handling */
    var rippleElements = find('.ripple');
    for (i=0; i < rippleElements.length; i++) {
        var rippledElement = rippleElements[i].parentNode;

        //var rippledElementHammer = new Hammer(rippledElement);
        new Hammer(rippledElement).on('tap', function(e) {
            // this.getBoundingClientRect();
            var bound = rippledElement.getBoundingClientRect();
            var x = e.clientX - bound.left;
            var y = e.clientY - bound.top;
            // this.querySelector('.ripple')
            var ripple = rippledElement.querySelector('.ripple');

            TweenLite.set(ripple, {x: x, y: y, scaleX: 0, scaleY: 0, opacity: 1});

            TweenLite.to(ripple, 1.5, {scaleX: 1, scaleY: 1, opacity: 0, ease: Expo.easeOut});

        });
    }
  });
})();
