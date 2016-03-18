(function () {

  function loadHammer() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.6/hammer.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  }

  function init() {
    loadHammer();
  }

  init();

})();