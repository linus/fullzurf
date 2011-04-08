(function() {
  chrome.extension.onConnect.addListener(function(port) {
    return port.onMessage.addListener(function(msg) {
      var direction;
      if (direction = msg.tab) {
        return chrome.tabs.getAllInWindow(null, function(tabs) {
          var selected, tab;
          selected = tabs.filter(function(tab) {
            return tab.selected;
          });
          selected = selected[0];
          if (direction === 'prev') {
            tab = selected.index ? tabs[selected.index - 1] : tabs[tabs.length - 1];
          } else {
            tab = selected.index === tabs.length - 1 ? tabs[0] : tabs[selected.index + 1];
          }
          return chrome.tabs.update(tab.id, {
            selected: true
          }, function(tab) {});
        });
      }
    });
  });
}).call(this);
