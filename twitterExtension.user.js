// ==UserScript==
// @name         Twitter Extension
// @namespace    https://chann.dev/
// @version      0.1
// @description  Twitter Extension
// @author       CHANN <chann@chann.kr>
// @match        http*://twitter.com/*
// @run-at       document-end
// ==/UserScript==

const overrideStyle = document.createElement('style')
overrideStyle.innerHTML = `
div[lang=ko] {
  word-break: keep-all;
  word-wrap: break-word
}
`
document.head.appendChild(overrideStyle)

// TODO: Use MutationObserver
const observer = new MutationObserver((mutations) => {})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})

window.addEventListener('keyup', (event) => {
  event = event || window.event
  const keyCode = event.code

  const popupMenu = document.querySelector('[role=menu]')
  const closeBtn = document.querySelector('[aria-label=Close]')
  const backBtn = document.querySelector('[aria-label=Back]')
  if (keyCode === 'Escape') {
    if (popupMenu !== null) {
      popupMenu.remove()
      return
    } else if (closeBtn !== null) {
      closeBtn.click()
      return
    } else if (backBtn !== null) {
      backBtn.click()
      return
    }
  }
})
window.removeEventListener('keyup')
