(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.PullToRefresh = factory());
}(this, (function () {

  function _ptrMarkup2() { return "\n<div class=\"__PREFIX__box\">\n  <div class=\"__PREFIX__content\">\n    <div class=\"__PREFIX__icon\"></div>\n    <div class=\"__PREFIX__text\"></div>\n  </div>\n</div>"; }

  function _ptrStyles2() { return ".__PREFIX__ptr2 {\n  box-shadow: inset 0 -3px 5px rgba(0, 0, 0, 0.12);\n  pointer-events: none;\n  font-size: 0.85em;\n  font-weight: bold;\n  bottom: 0;\n  height: 0;\n  transition: height 0.3s, min-height 0.3s;\n  text-align: center;\n  width: 100%;\n  overflow: hidden;\n  display: flex;\n  align-items: flex-end;\n  align-content: stretch;\n}\n.__PREFIX__box {\n  padding: 10px;\n  flex-basis: 100%;\n}\n.__PREFIX__pull {\n  transition: none;\n}\n.__PREFIX__text {\n  margin-top: 0.33em;\n  color: rgba(0, 0, 0, 0.3);\n}\n.__PREFIX__icon {\n  color: rgba(0, 0, 0, 0.3);\n  transition: transform 0.3s;\n}\n.__PREFIX__top {\n  touch-action: pan-x pan-up pinch-zoom;\n}\n.__PREFIX__release .__PREFIX__icon {\n  transform: rotate(180deg);\n}\n"; }

  var _defaults = {
    distThreshold2: 120,
    distMax2: 140,
    distReload2: 120,
    distIgnore2: 40,
    bodyOffset2: 20,
    mainElement2: 'body',
    triggerElement2: 'body',
    ptrElement2: '.ptr2',
    classPrefix2: 'ptr2--',
    cssProp2: 'min-height',
    iconArrow2: '&#8675;',
    iconRefreshing2: '&hellip;',
    instructionsPullToRefresh2: 'Pull up to to go down',
    instructionsReleaseToRefresh2: 'release',
    instructionsRefreshing2: 'traveling',
    refreshTimeout2: 500,
    getMarkup2: _ptrMarkup2,
    getStyles2: _ptrStyles2,
    onInit2: function () { console.log("hey") },
    onRefresh2: function () { return location.reload(); },
    resistanceFunction2: function (t) { return Math.min(1, t / 2.5); },
    shouldPullToRefresh2: function () { return !window.scrollY; },
  };

  var _methods = ['mainElement2', 'ptrElement2', 'triggerElement2'];

  var _shared = {
    pullStartY2: null,
    pullMoveY2: null,
    handlers2: [],
    styleEl2: null,
    events2: null,
    dist2: 0,
    state2: 'pending',
    timeout2: null,
    distResisted2: 0,
    supportsPassive2: false,
  };

  try {
    window.addEventListener('test2', null, {
      get passive() { // eslint-disable-line getter-return
        _shared.supportsPassive2 = true;
      },
    });
  } catch (e) {
    // do nothing
  }
  //hmmm changing handler might not work
  var _ptr2 = {
    setupDOM2: function setupDOM2(handler2) {
      if (!handler2.ptrElement2) {
        var ptr2 = document.createElement('div');

        if (handler2.mainElement2 !== document.body) {
          handler2.mainElement2.parentNode.appendChild(ptr2);
        } else {
          document.body.appendChild(ptr2);
        }
        //i just changed the above ^^^^ to document.body.lastChild because i think it will append the box at the bottom of the page
        ptr2.classList.add(((handler2.classPrefix2) + "ptr2"));
        ptr2.innerHTML = handler2.getMarkup2()
          .replace(/__PREFIX__/g, handler2.classPrefix2);

        handler2.ptrElement2 = ptr2;

        if (typeof handler2.onInit2 === 'function') {
          handler2.onInit2(handler2);
        }

        // Add the css styles to the style node, and then
        // insert it into the dom
        if (!_shared.styleEl2) {
          _shared.styleEl2 = document.createElement('style');
          _shared.styleEl2.setAttribute('id', 'pull-to-refresh-js-style');

          document.head.appendChild(_shared.styleEl2);
        }

        _shared.styleEl2.textContent = handler2.getStyles2()
          .replace(/__PREFIX__/g, handler2.classPrefix2)
          .replace(/\s+/g, ' ');
      }

      return handler2;
    },
    onReset: function onReset(handler2) {
      handler2.ptrElement2.classList.remove(((handler2.classPrefix2) + "refresh"));
      handler2.ptrElement2.style[handler2.cssProp2] = '0px';

      setTimeout(function () {
        // remove previous ptr2-element from DOM
        if (handler2.ptrElement2 && handler2.ptrElement2.parentNode) {
          handler2.ptrElement2.parentNode.removeChild(handler2.ptrElement2);
          handler2.ptrElement2 = null;
        }

        // reset state2
        _shared.state2 = 'pending';
      }, handler2.refreshTimeout2);
    },
    update2: function update2(handler2) {
      var iconEl = handler2.ptrElement2.querySelector(("." + (handler2.classPrefix2) + "icon"));
      var textEl = handler2.ptrElement2.querySelector(("." + (handler2.classPrefix2) + "text"));

      if (iconEl) {
        if (_shared.state2 === 'refreshing') {
          iconEl.innerHTML = handler2.iconRefreshing2;
        } else {
          iconEl.innerHTML = handler2.iconArrow2;
        }
      }

      if (textEl) {
        if (_shared.state2 === 'releasing') {
          textEl.innerHTML = handler2.instructionsReleaseToRefresh2;
        }

        if (_shared.state2 === 'pulling' || _shared.state2 === 'pending') {
          textEl.innerHTML = handler2.instructionsPullToRefresh2;
        }

        if (_shared.state2 === 'refreshing') {
          textEl.innerHTML = handler2.instructionsRefreshing2;
        }
      }
    },
  };

  function _setupEvents() {
    var _el2;

    function _onTouchStart(e) {
      // here, we must pick a handler2 first, and then append their html/css on the DOM
      var target = _shared.handlers2.filter(function (h) { return h.contains(e.target); })[0];

      _shared.enable = !!target;

      if (target && _shared.state2 === 'pending') {
        _el2 = _ptr2.setupDOM2(target);

        if (target.shouldPullToRefresh2()) {
          _shared.pullStartY2 = e.touches[0].screenY;
          console.log(e.touches[0])
        }

        clearTimeout(_shared.timeout2);

        _ptr2.update2(target);
      }
    }

    function _onTouchMove(e) {
      if (!(_el2 && _el2.ptrElement2 && _shared.enable)) {
        return;
      }

      if (!_shared.pullStartY2) {
        if (_el2.shouldPullToRefresh2()) {
          _shared.pullStartY2 = e.touches[0].screenY;
        }
      } else {
        _shared.pullMoveY2 = e.touches[0].screenY;
      }

      if (_shared.state2 === 'refreshing') {
        if (_el2.shouldPullToRefresh2() && _shared.pullStartY2 > _shared.pullMoveY2) {
          e.preventDefault();
        }

        return;
      }

      if (_shared.state2 === 'pending') {
        _el2.ptrElement2.classList.add(((_el2.classPrefix2) + "pull"));
        _shared.state2 = 'pulling';
        _ptr2.update2(_el2);
      }

      if (_shared.pullStartY2 && _shared.pullMoveY2) {
        _shared.dist2 = _shared.pullStartY2 - _shared.pullMoveY2;
      }

      _shared.distExtra = _el2.distIgnore2 - _shared.dist2;

      if (_shared.distExtra < 0) {
        //maybe this will work^^^?? i changed it?
        e.preventDefault();

        _el2.ptrElement2.style[_el2.cssProp2] = (_shared.distResisted2) + "px";

        _shared.distResisted2 = _el2.resistanceFunction2(_shared.distExtra / _el2.distThreshold2)
          * Math.min(_el2.distMax2, _shared.distExtra);

        if (_shared.state2 === 'pulling' && _shared.distResisted2 > _el2.distThreshold2) {
          _el2.ptrElement2.classList.add(((_el2.classPrefix2) + "release"));
          _shared.state2 = 'releasing';
          _ptr2.update2(_el2);
        }

        if (_shared.state2 === 'releasing' && _shared.distResisted2 <
          _el2.distThreshold2) {
          _el2.ptrElement2.classList.remove(((_el2.classPrefix2) + "release"));
          _shared.state2 = 'pulling';
          _ptr2.update2(_el2);
        }
      }
    }

    function _onTouchEnd() {
      if (!(_el2 && _el2.ptrElement2 && _shared.enable)) {
        return;
      }

      if (_shared.state2 === 'releasing' && _shared.distResisted2 > _el2.distThreshold2) {
        _shared.state2 = 'refreshing';

        _el2.ptrElement2.style[_el2.cssProp2] = (_el2.distReload2) + "px";
        _el2.ptrElement2.classList.add(((_el2.classPrefix2) + "refresh"));

        _shared.timeout2 = setTimeout(function () {
          var retval = _el2.onRefresh2(function () { return _ptr2.onReset(_el2); });

          if (retval && typeof retval.then === 'function') {
            retval.then(function () { return _ptr2.onReset(_el2); });
          }

          if (!retval && !_el2.onRefresh2.length) {
            _ptr2.onReset(_el2);
          }
        }, _el2.refreshTimeout2);
      } else {
        if (_shared.state2 === 'refreshing') {
          return;
        }

        _el2.ptrElement2.style[_el2.cssProp2] = '0px';

        _shared.state2 = 'pending';
      }

      _ptr2.update2(_el2);

      _el2.ptrElement2.classList.remove(((_el2.classPrefix2) + "release"));
      _el2.ptrElement2.classList.remove(((_el2.classPrefix2) + "pull"));

      _shared.pullStartY2 = _shared.pullMoveY2 = null;
      _shared.dist2 = _shared.distResisted2 = 0;
    }

    function _onScroll() {
      if (_el2) {
        _el2.mainElement2.classList.toggle(((_el2.classPrefix2) + "top"), _el2.shouldPullToRefresh2());
      }
    }

    var _passiveSettings = _shared.supportsPassive2
      ? { passive: _shared.passive || false }
      : undefined;

    window.addEventListener('touchend', _onTouchEnd);
    window.addEventListener('touchstart', _onTouchStart);
    window.addEventListener('touchmove', _onTouchMove, _passiveSettings);
    window.addEventListener('scroll', _onScroll);

    return {
      onTouchEnd: _onTouchEnd,
      onTouchStart: _onTouchStart,
      onTouchMove: _onTouchMove,
      onScroll: _onScroll,

      destroy: function destroy() {
        // Teardown event listeners
        window.removeEventListener('touchstart', _onTouchStart);
        window.removeEventListener('touchend', _onTouchEnd);
        window.removeEventListener('touchmove', _onTouchMove, _passiveSettings);
        window.removeEventListener('scroll', _onScroll);
      },
    };
  }

  function _setupHandler(options) {
    var _handler = {};

    // merge options with defaults
    Object.keys(_defaults).forEach(function (key) {
      _handler[key] = options[key] || _defaults[key];
    });

    // normalize timeout2 value, even if it is zero
    _handler.refreshTimeout2 = typeof options.refreshTimeout2 === 'number'
      ? options.refreshTimeout2
      : _defaults.refreshTimeout2;

    // normalize elements
    _methods.forEach(function (method) {
      if (typeof _handler[method] === 'string') {
        _handler[method] = document.querySelector(_handler[method]);
      }
    });

    // attach events2 lazily
    if (!_shared.events2) {
      _shared.events2 = _setupEvents();
    }

    _handler.contains = function (target) {
      return _handler.triggerElement2.contains(target);
    };

    _handler.destroy = function () {
      // stop pending any pending callbacks
      clearTimeout(_shared.timeout2);

      // remove handler2 from shared state2
      _shared.handlers2.splice(_handler.offset, 1);
    };

    return _handler;
  }

  // public API
  var index = {
    setPassiveMode: function setPassiveMode(isPassive) {
      _shared.passive = isPassive;
    },
    destroyAll: function destroyAll() {
      if (_shared.events2) {
        _shared.events2.destroy();
        _shared.events2 = null;
      }

      _shared.handlers2.forEach(function (h) {
        h.destroy();
      });
    },
    init: function init(options) {
      if (options === void 0) options = {};

      var handler2 = _setupHandler(options);

      // store offset for later unsubscription
      handler2.offset = _shared.handlers2.push(handler2) - 1;

      return handler2;
    },

    // export utils for testing
    _: {
      setupHandler: _setupHandler,
      setupEvents: _setupEvents,
      setupDOM2: _ptr2.setupDOM2,
      onReset: _ptr2.onReset,
      update2: _ptr2.update2,
    },
  };

  return index;

})));
