applyStyles = (styles) ->
  stylesheet = document.styleSheets[1]
  addRule = stylesheet.addRule or stylesheet.insertRule

  for selector, props of styles when selector isnt 'common'
    addRule.call(stylesheet, "#fullZurf #{selector}", prop) for prop in props.concat(styles.common)

colors =
  dark: 'rgba(0, 0, 0, 0.5)'
  light: 'rgb(223, 223, 223)'
  light_trans: 'rgba(255, 255, 255, 0.5)'

applyStyles
  'common': [
    'position: fixed'
    'z-index: 1000'
  ]
  'button': [
    "padding: 0.25em"
    "width: 2em"
    "height: 2em"
    "font-size: 3em"
    "color: #{colors.light}"
    "background: #{colors.dark}"
    "border: none"
  ]
  'button.top': [ "top: 0" ]
  'button.bottom': [ "bottom: 0" ]
  'button.left': [ "left: 0" ]
  'button.right': [ "right: 0" ]
  'button.top.left': [
    'border-bottom-right-radius: 0.125em'
    '-webkit-border-bottom-right-radius: 0.125em'
  ]
  'button.top.right': [
    'border-bottom-left-radius: 0.125em'
    '-webkit-border-bottom-left-radius: 0.125em'
  ]
  'button.bottom.left': [
    'border-top-right-radius: 0.125em'
    '-webkit-border-top-right-radius: 0.125em'
  ]
  'button.bottom.left': [
    'border-top-right-radius: 0.125em'
    '-webkit-top-bottom-right-radius: 0.125em'
  ]
  'button:hover': [
    'cursor: pointer'
    'text-decoration: none'
    "color: #{colors.dark}"
    "background: #{colors.light_trans}"
  ]
  'form': [
    "left: #{screen.width / 2 - 100}"
    "top: #{screen.height / 2 - 16}"
  ]
  'input': [
    "border: 3px solid #{colors.dark}"
    "color: #{colors.dark}"
    "background: #{colors.light}"
    'font-family: Ubuntu, Helvetica Neue, Helvetica, Arial, sans-serif'
    'font-size: 3em'
  ]

fullZurf = document.createElement('div')
fullZurf.id = 'fullZurf'
fullZurf.style.display = 'none'

createButton = (content, className, action) ->
  button = document.createElement('button')
  button.innerHTML = content
  button.onclick = action
  button.className = className

  return button

timeout = null
document.onmousemove = ->
  # only visible in fullscreen
  if screen.width is window.outerWidth and screen.height is window.outerHeight
    clearTimeout(timeout)
    fullZurf.style.display = 'block'
    timeout = setTimeout (-> fullZurf.style.display = 'none'), 1000

port = chrome.extension.connect name: 'fullZurf'
port.onMessage.addListener (message) -> console.log(message)

fullZurf.appendChild createButton('←', "top left", -> history.back())
fullZurf.appendChild createButton('→', "top right", -> history.forward())

fullZurf.appendChild createButton('↤', "bottom left", -> port.postMessage tab: 'prev')
fullZurf.appendChild createButton('↦', "bottom right", -> port.postMessage tab: 'next')

form = document.createElement('form')
input = document.createElement('input')
input.type = "text"

form.appendChild(input)

form.onsubmit = ->
  if input.value
    document.location = "http://www.google.com/search?sourceid=fullzurf&q=#{input.value}"

fullZurf.appendChild(form)

document.body.appendChild(fullZurf)
