(function() {
  var applyStyles, colors, createButton, form, fullZurf, gutter, input, port, timeout;
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
    'common': ['position: fixed', 'border-radius: 0.125em', '-moz-border-radius: 0.125em', '-webkit-border-radius: 0.125em', 'z-index: 1000'],
    'button': ["position: absolute", "padding: 0.25em", "width: 2em", "height: 2em", "font-size: 3em", "color: " + colors.light, "background: " + colors.dark, "border: none"],
    'button:hover': ['cursor: pointer', 'text-decoration: none', "color: " + colors.dark, "background: " + colors.light_trans],
    'form': ["left: " + (screen.width / 2 - 100), "top: " + (screen.height / 2 - 16)],
    'input': ["border: 3px solid " + colors.dark, "color: " + colors.dark, "background: " + colors.light, 'font-family: Ubuntu, Helvetica Neue, Helvetica, Arial, sans-serif', 'font-size: 3em']
  });
  fullZurf = document.createElement('div');
  fullZurf.id = 'fullZurf';
  fullZurf.style.display = 'none';
  createButton = function(container, content, props, action) {
    var attr, button, val;
    button = document.createElement('button');
    button.innerHTML = content;
    button.onclick = action;
    for (attr in props) {
      val = props[attr];
      button.style[attr] = val;
    }
    return container.appendChild(button);
  };
  gutter = {
    h: '0.5em',
    v: '0.25em'
  };
  timeout = null;
  document.onmousemove = function() {
    clearTimeout(timeout);
    fullZurf.style.display = 'block';
    return timeout = setTimeout((function() {
      return fullZurf.style.display = 'none';
    }), 1000);
  };
  port = chrome.extension.connect({
    name: 'fullZurf'
  });
  port.onMessage.addListener(function(message) {
    return console.log(message);
  });
  createButton(fullZurf, '←', {
    top: gutter.h,
    left: gutter.v
  }, function() {
    return history.back();
  });
  createButton(fullZurf, '→', {
    top: gutter.h,
    right: gutter.v
  }, function() {
    return history.forward();
  });
  createButton(fullZurf, '↤', {
    bottom: gutter.h,
    left: gutter.v
  }, function() {
    return port.postMessage({
      tab: 'prev'
    });
  });
  createButton(fullZurf, '↦', {
    bottom: gutter.h,
    right: gutter.v
  }, function() {
    return port.postMessage({
      tab: 'next'
    });
  });
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
