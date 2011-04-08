chrome.extension.onConnect.addListener (port) ->
  port.onMessage.addListener (msg) ->
    if direction = msg.tab
      chrome.tabs.getAllInWindow null, (tabs) ->
        selected = tabs.filter (tab) -> tab.selected
        selected = selected[0]
        if direction is 'prev'
          tab = if selected.index then tabs[selected.index - 1] else tabs[tabs.length - 1]
        else
          tab = if selected.index is tabs.length - 1 then tabs[0] else tabs[selected.index + 1]
  
        chrome.tabs.update tab.id, selected: true, (tab) ->
