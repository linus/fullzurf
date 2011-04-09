(function() {
  var applyStyles, colors, createButton, form, fullZurf, input, port, timeout;
  applyStyles = function(styles) {
    var addRule, prop, props, selector, stylesheet, _results;
    stylesheet = document.styleSheets[1];
    addRule = stylesheet.addRule || stylesheet.insertRule;
    _results = [];
    for (selector in styles) {
      props = styles[selector];
      if (selector !== 'common') {
        _results.push((function() {
          var _i, _len, _ref, _results;
          _ref = props.concat(styles.common);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            _results.push(addRule.call(stylesheet, "#fullZurf " + selector, prop));
          }
          return _results;
        })());
      }
    }
    return _results;
  };
  colors = {
    dark: 'rgba(0, 0, 0, 0.5)',
    light: 'rgb(223, 223, 223)',
    light_trans: 'rgba(255, 255, 255, 0.5)'
  };
  applyStyles({
    'common': ['position: fixed', 'z-index: 1000'],
    'button': ["padding: 0.25em", "width: 2em", "height: 2em", "font-size: 3em", "color: " + colors.light, "background: " + colors.dark, "border: none"],
    'button.top': ["top: 0"],
    'button.bottom': ["bottom: 0"],
    'button.left': ["left: 0"],
    'button.right': ["right: 0"],
    'button.top.left': ['border-bottom-right-radius: 0.125em', '-webkit-border-bottom-right-radius: 0.125em'],
    'button.top.right': ['border-bottom-left-radius: 0.125em', '-webkit-border-bottom-left-radius: 0.125em'],
    'button.bottom.left': ['border-top-right-radius: 0.125em', '-webkit-border-top-right-radius: 0.125em'],
    'button.bottom.left': ['border-top-right-radius: 0.125em', '-webkit-top-bottom-right-radius: 0.125em'],
    'button:hover': ['cursor: pointer', 'text-decoration: none', "color: " + colors.dark, "background: " + colors.light_trans],
    'form': ["left: " + (screen.width / 2 - 100), "top: " + (screen.height / 2 - 16)],
    'input': ["border: 3px solid " + colors.dark, "color: " + colors.dark, "background: " + colors.light, 'font-family: Ubuntu, Helvetica Neue, Helvetica, Arial, sans-serif', 'font-size: 3em']
  });
  fullZurf = document.createElement('div');
  fullZurf.id = 'fullZurf';
  fullZurf.style.display = 'none';
  createButton = function(content, className, action) {
    var button;
    button = document.createElement('button');
    button.innerHTML = content;
    button.onclick = action;
    button.className = className;
    return button;
  };
  timeout = null;
  document.onmousemove = function() {
    if (screen.width === window.outerWidth && screen.height === window.outerHeight) {
      clearTimeout(timeout);
      fullZurf.style.display = 'block';
      return timeout = setTimeout((function() {
        return fullZurf.style.display = 'none';
      }), 1000);
    }
  };
  port = chrome.extension.connect({
    name: 'fullZurf'
  });
  port.onMessage.addListener(function(message) {
    return console.log(message);
  });
  fullZurf.appendChild(createButton('←', "top left", function() {
    return history.back();
  }));
  fullZurf.appendChild(createButton('→', "top right", function() {
    return history.forward();
  }));
  fullZurf.appendChild(createButton('↤', "bottom left", function() {
    return port.postMessage({
      tab: 'prev'
    });
  }));
  fullZurf.appendChild(createButton('↦', "bottom right", function() {
    return port.postMessage({
      tab: 'next'
    });
  }));
  form = document.createElement('form');
  input = document.createElement('input');
  input.type = "text";
  form.appendChild(input);
  form.onsubmit = function() {
    if (input.value) {
      return document.location = "http://www.google.com/search?sourceid=fullzurf&q=" + input.value;
    }
  };
  fullZurf.appendChild(form);
  document.body.appendChild(fullZurf);
}).call(this);
