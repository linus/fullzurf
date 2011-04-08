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
    'border-radius: 0.125em'
    '-moz-border-radius: 0.125em'
    '-webkit-border-radius: 0.125em'
    'z-index: 1000'
  ]
  'button': [
    "position: absolute"
    "padding: 0.25em"
    "width: 2em"
    "height: 2em"
    "font-size: 3em"
    "color: #{colors.light}"
    "background: #{colors.dark}"
    "border: none"
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

createButton = (container, content, props, action) ->
  button = document.createElement('button')
  button.innerHTML = content
  button.onclick = action
  for attr, val of props
    button.style[attr] = val
  
  container.appendChild(button)

gutter =
  h: '0.5em'
  v: '0.25em'

timeout = null
document.onmousemove = ->
  # only visible in fullscreen
  #if screen.width is window.innerWidth and screen.height is window.innerHeight
  clearTimeout(timeout)
  fullZurf.style.display = 'block'
  timeout = setTimeout (-> fullZurf.style.display = 'none'), 1000

port = chrome.extension.connect name: 'fullZurf'
port.onMessage.addListener (message) -> console.log(message)

createButton fullZurf, '←', top: gutter.h, left: gutter.v, -> history.back()
createButton fullZurf, '→', top: gutter.h, right: gutter.v, -> history.forward()

createButton fullZurf, '↤', bottom: gutter.h, left: gutter.v, -> port.postMessage tab: 'prev'
createButton fullZurf, '↦', bottom: gutter.h, right: gutter.v, -> port.postMessage tab: 'next'

form = document.createElement('form')
input = document.createElement('input')
input.type = "text"

form.appendChild(input)

form.onsubmit = ->
  if input.value
    document.location = "http://www.google.com/search?sourceid=fullzurf&q=#{input.value}"

fullZurf.appendChild(form)

document.body.appendChild(fullZurf)
