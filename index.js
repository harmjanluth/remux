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

  $(function () {

    // Swipe
    (function () {
      new Hammer($(".swipe")[0], {
        domEvents: true
      });
      var current = 0;
      var imgs = $(".demo-box.swipe img");
      var pages = $(".swipe .page-num span");
      $(".swipe").on("swipeleft", function (e) {
        if (imgs[current + 1]) {
          imgs.removeClass("active");
          imgs.eq(++current).addClass("active");
          pages.removeClass("active");
          pages.eq(current).addClass("active");
        }
      });
      $(".swipe").on("swiperight", function (e) {
        if (imgs[current - 1]) {
          imgs.removeClass("active");
          imgs.eq(--current).addClass("active");
          pages.removeClass("active");
          pages.eq(current).addClass("active");
        }
      });
    })();

    // Pan
    (function () {
      var img, margin;
      new Hammer($(".pan")[0], {
        domEvents: true
      });
      $(".pan").on("panstart", function (e) {
        img = $(".pan img");
        margin = parseInt(img.css("margin-left"), 10);
      });
      $(".pan").on("pan", function (e) {
        console.log("pan");
        var delta = margin + e.originalEvent.gesture.deltaX;
        console.log(delta);
        if (delta >= -1750 && delta <= -150) {
          img.css({
            "margin-left": margin + e.originalEvent.gesture.deltaX
          });
        }
      });
    })();

    // tap
    (function () {
      new Hammer($(".tap")[0], {
        domEvents: true
      });
      var current = 0;
      var imgs = $(".demo-box.tap img");
      var pages = $(".tap .page-num span");
      $(".tap").on("tap", function (e) {
        console.log("tap");
        if (imgs[current + 1]) {
          current++;
        } else {
          current = 0;
        }
        console.log(current);
        imgs.removeClass("active");
        imgs.eq(current).addClass("active");
        pages.removeClass("active");
        pages.eq(current).addClass("active");
      });
    })();

    // press
    (function () {
      new Hammer($(".press")[0], {
        domEvents: true
      });
      $(".press").on("press", function (e) {
        $(".demo-overlay").toggle();
      });
    })();
    // pinch
    (function () {
      var ham = new Hammer($(".pinch")[0], {
        domEvents: true
      });
      var width = 1900;
      var height = 400;
      var left = 950;
      var top = 220;
      ham.get('pinch').set({enable: true});
      $(".pinch").on("pinch", function (e) {
        console.log("pinch");
        if (width * e.originalEvent.gesture.scale >= 300) {
          $(this).find("img").css({
            width: width * e.originalEvent.gesture.scale,
            "margin-left": -left * e.originalEvent.gesture.scale,
            height: height * e.originalEvent.gesture.scale,
            "margin-top": -top * e.originalEvent.gesture.scale
          });
        }
        console.log(e.originalEvent.gesture.scale);
      });
      $(".pinch").on("pinchend", function (e) {
        width = width * e.originalEvent.gesture.scale;
        height = height * e.originalEvent.gesture.scale;
        left = left * e.originalEvent.gesture.scale;
        top = top * e.originalEvent.gesture.scale;
        console.log(width);
      });
    })();
    // rotate
    (function () {
      var ham = new Hammer($(".rotate")[0], {
        domEvents: true
      });
      var liveScale = 1;
      var currentRotation = 0;

      ham.get('rotate').set({enable: true});
      $(".rotate").on("rotate", function (e) {
        var rotation = currentRotation + Math.round(liveScale * e.originalEvent.gesture.rotation);
        $(this).find("img").css("transform", "rotate( " + rotation + "deg)");
      });
      $(".rotate").on("rotateend", function (e) {
        currentRotation += Math.round(e.originalEvent.gesture.rotation);
      });
    })();

    // Hammer Time
    $(function () {
      var upEvent = window.PointerEvent ? "pointerup" : ( ( 'ontouchstart' in window ) || window.DocumentTouch && document instanceof DocumentTouch ) ? "touchend" : "mouseup";
      $(".target").on(upEvent, function (e) {
        this.startTime = Date.now();
        $(this).find(".output").html(e.type + ": " + this.startTime + "<br>");
      });
      $(".target").on("click", function (e) {
        var now = Date.now();
        var clickTime = now - this.startTime;
        var target = $(this);
        var status = clickTime < 100 ? "" : clickTime < 300 ? "warning" : "failure"
        target.find(".click-gauge")
          .attr("value", clickTime)
          .removeClass("failure success")
          .addClass(status);
        target.find(".click-time-output").text(clickTime + "ms");
        target.find(".output").append("click: " + now + "<br>");
        $(this).addClass("clicked");
        setTimeout(function () {
          $(this).removeClass("clicked");
        }.bind(this), 1000)
      });
    });
  });
  /**
   * kind of messy code, but good enough for now
   */
  // polyfill
  var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  var screen = document.querySelector(".device-screen");
  var el = document.querySelector("#hitarea");

  var START_X = Math.round((screen.offsetWidth - el.offsetWidth) / 2);
  var START_Y = Math.round((screen.offsetHeight - el.offsetHeight) / 2);

  var ticking = false;
  var transform;
  var timer;

  var mc = new Hammer.Manager(el);

  mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));

  mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
  mc.add(new Hammer.Rotate({threshold: 0})).recognizeWith(mc.get('pan'));
  mc.add(new Hammer.Pinch({threshold: 0})).recognizeWith([mc.get('pan'), mc.get('rotate')]);

  mc.add(new Hammer.Tap({event: 'doubletap', taps: 2}));
  mc.add(new Hammer.Tap());

  mc.on("panstart panmove", onPan);
  mc.on("rotatestart rotatemove", onRotate);
  mc.on("pinchstart pinchmove", onPinch);
  mc.on("swipe", onSwipe);
  mc.on("tap", onTap);
  mc.on("doubletap", onDoubleTap);

  mc.on("hammer.input", function (ev) {
    if (ev.isFinal) {
      resetElement();
    }
  });

  function logEvent(ev) {
    //el.innerText = ev.type;
  }

  function resetElement() {
    el.className = 'animate';
    transform = {
      translate: {x: START_X, y: START_Y},
      scale: 1,
      angle: 0,
      rx: 0,
      ry: 0,
      rz: 0
    };
    requestElementUpdate();
  }

  function updateElementTransform() {
    var value = [
      'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
      'scale(' + transform.scale + ', ' + transform.scale + ')',
      'rotate3d(' + transform.rx + ',' + transform.ry + ',' + transform.rz + ',' + transform.angle + 'deg)'
    ];

    value = value.join(" ");
    el.style.webkitTransform = value;
    el.style.mozTransform = value;
    el.style.transform = value;
    ticking = false;
  }

  function requestElementUpdate() {
    if (!ticking) {
      reqAnimationFrame(updateElementTransform);
      ticking = true;
    }
  }

  function onPan(ev) {
    el.className = '';
    transform.translate = {
      x: START_X + ev.deltaX,
      y: START_Y + ev.deltaY
    };

    logEvent(ev);
    requestElementUpdate();
  }

  var initScale = 1;

  function onPinch(ev) {
    if (ev.type == 'pinchstart') {
      initScale = transform.scale || 1;
    }

    el.className = '';
    transform.scale = initScale * ev.scale;

    logEvent(ev);
    requestElementUpdate();
  }

  var initAngle = 0;

  function onRotate(ev) {
    if (ev.type == 'rotatestart') {
      initAngle = transform.angle || 0;
    }

    el.className = '';
    transform.rz = 1;
    transform.angle = initAngle + ev.rotation;

    logEvent(ev);
    requestElementUpdate();
  }

  function onSwipe(ev) {
    var angle = 50;
    transform.ry = (ev.direction & Hammer.DIRECTION_HORIZONTAL) ? 1 : 0;
    transform.rx = (ev.direction & Hammer.DIRECTION_VERTICAL) ? 1 : 0;
    transform.angle = (ev.direction & (Hammer.DIRECTION_RIGHT | Hammer.DIRECTION_UP)) ? angle : -angle;

    clearTimeout(timer);
    timer = setTimeout(function () {
      resetElement();
    }, 300);

    logEvent(ev);
    requestElementUpdate();
  }

  function onTap(ev) {
    transform.rx = 1;
    transform.angle = 25;

    clearTimeout(timer);
    timer = setTimeout(function () {
      resetElement();
    }, 200);

    logEvent(ev);
    requestElementUpdate();
  }

  function onDoubleTap(ev) {
    transform.rx = 1;
    transform.angle = 80;

    clearTimeout(timer);
    timer = setTimeout(function () {
      resetElement();
    }, 500);

    logEvent(ev);
    requestElementUpdate();
  }

  resetElement();

  document.querySelector(".device-button").addEventListener("click", function () {
    document.querySelector(".device").classList.toggle('hammertime');
  }, false);

  init();

})();