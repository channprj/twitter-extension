// ==UserScript==
// @name         Twitter Extension
// @namespace    https://chann.dev/
// @version      0.2
// @icon https://user-images.githubusercontent.com/1831308/99884645-3101e100-2c73-11eb-9258-958dee09457e.png
// @description  Twitter Extension
// @author       CHANN <chann@chann.kr>
// @match        http*://twitter.com/*
// @run-at       document-end
// ==/UserScript==

// Override styles
// ------------------------------------------------------------
const overrideStyle = document.createElement('style')
overrideStyle.innerHTML = `
div[lang=ko] {
  word-break: keep-all;
  word-wrap: break-word;
}
`
document.head.appendChild(overrideStyle)

// Keyboard shortcuts
// ------------------------------------------------------------
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
// window.removeEventListener('keyup')

// TEMP: hongSeonbi translator
// TODO: Find a new way rather than after 3s
// ------------------------------------------------------------
const hongSeonbiTranslator = () => {
  try {
    setTimeout(() => {
      const config = {
        attributes: true,
        childList: true,
        // subtree: true,
      }

      // TODO: Change timeline selector when it changed something
      // const timeline = document.querySelector('.css-1dbjc4n > div > div')
      // const timeline = document.querySelector(
      //   '[aria-labelledby="accessible-list-0"] > div > div'
      // )
      const timeline = document.querySelector(
        '[aria-label="Timeline: Your Home Timeline"] > div'
      )
      console.debug('timeline', timeline)

      // Translate seonbi's tweet
      const hongSeonbi = (mutationsList) => {
        // console.debug('mutationsList', mutationsList)
        for (const mutation of mutationsList) {
          // Find seonbi and translate if timeline updated
          if (mutation.type === 'childList') {
            // console.debug('mutation', mutation)
            mutation.target.children.forEach((tweet) => {
              const authorLink = tweet.querySelector(
                'div > div > article > div > div > div > div:nth-child(2) > div:nth-child(2) > div:first-child > div > div > div:first-child > div:first-child > a'
              )
              // console.debug('authorLink', authorLink)
              if (authorLink) {
                const targetUsers = [
                  'hong2tu4',
                  'channprj',
                  'BBCWorld',
                  'CNN',
                  'cnnbrk',
                  'resten1497',
                  'blurfxo',
                  'nameEO',
                  'haruair',
                  'shiftpsh',
                  'salgujelly',
                  'shiftpsh',
                  '_jeyraof',
                ]
                let username = authorLink.getAttribute('href').split('/')[1]
                // console.debug('username', username)
                if (targetUsers.includes(username)) {
                  const nameElem = authorLink.querySelector(
                    'div > div:first-child > div:first-child > span > span'
                  )
                  nameElem.style.color = 'red'
                }
              }
            })
            console.debug('mutation.target', mutation.target)
          } else if (mutation.type === 'attributes') {
            // mutation.attributeName attribute was modified.
          }
        }
      }
      const observer = new MutationObserver(hongSeonbi)
      observer.observe(timeline, config)
    }, 3000)
  } catch (error) {
    console.debug('hongSeonbiTranslator', error)
    throw error
  }
}

// Apply hongSeonbiTranslator with scroll event
hongSeonbiTranslator()
let timer = null
window.addEventListener(
  'scroll',
  (event) => {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      hongSeonbiTranslator()
    }, 150)
  },
  false
)
