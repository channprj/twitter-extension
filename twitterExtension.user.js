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

// Override Event
// ------------------------------------------------------------
history.pushState = ((f) =>
  function pushState() {
    var ret = f.apply(this, arguments)
    window.dispatchEvent(new Event('pushstate'))
    window.dispatchEvent(new Event('locationchange'))
    return ret
  })(history.pushState)

history.replaceState = ((f) =>
  function replaceState() {
    var ret = f.apply(this, arguments)
    window.dispatchEvent(new Event('replacestate'))
    window.dispatchEvent(new Event('locationchange'))
    return ret
  })(history.replaceState)

window.addEventListener('popstate', () => {
  window.dispatchEvent(new Event('locationchange'))
})

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
// ------------------------------------------------------------
const timelineSelector = () => {
  // TODO: Change timeline selector when it changed something
  // const timeline = document.querySelector('.css-1dbjc4n > div > div')
  // const timeline = document.querySelector(
  //   '[aria-labelledby="accessible-list-0"] > div > div'
  // )
  let timeline = document.querySelector(
    '[aria-label="Timeline: Your Home Timeline"] > div'
  )
  if (timeline === null) {
    const labelArray = document.querySelectorAll('*[aria-label]')
    for (let i = 0; i < labelArray.length; i++) {
      const labelText = labelArray[i].ariaLabel
      if (labelText.includes('Timeline:') && labelText.includes('Tweets')) {
        timeline = labelArray[i].querySelector('div')
      }
    }
  }
  console.debug('timelineSelector:timeline', timeline)
  return timeline
}

const hongSeonbiMutation = (mutationsList) => {
  console.debug('hongSeonbiMutation:mutationsList', mutationsList)
  // console.debug('mutationsList', mutationsList)
  for (const mutation of mutationsList) {
    // Find seonbi and translate if timeline updated
    if (mutation.type === 'childList') {
      // console.debug('mutation', mutation)
      mutation.target.children.forEach((tweet) => {
        let authorSelector =
          'div > div > article > div > div > div > div:nth-child(2) > div:nth-child(2) > div:first-child > div > div > div:first-child > div:first-child > a'
        // Reassign the author selector for target user timeline
        const targetUserTimeline = ['/hong2tu4', '/salgujelly', '/channprj']
        if (targetUserTimeline.includes(document.location.pathname)) {
          authorSelector =
            'div > div > article > div > div > div > div:nth-child(2) > div:nth-child(2) > div:first-child > div > div > div:first-child > div:first-child > a'
        }
        const authorLink = tweet.querySelector(authorSelector)
        // console.debug('authorLink', authorLink)
        if (authorLink) {
          const targetUsers = [
            'hong2tu4',
            'salgujelly',
            'channprj',
            'BBCWorld',
            'CNN',
            'cnnbrk',
            'F1',
            'resten1497',
            'blurfxo',
            'nameEO',
            'haruair',
            'shiftpsh',
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
          // TODO: Translate seonbi's tweet
        }
      })
      console.debug('mutation.target', mutation.target)
    } else if (mutation.type === 'attributes') {
      // mutation.attributeName attribute was modified.
    }
  }
}

const hongSeonbiTranslator = (timeout = 3000) => {
  try {
    // TODO: Find a new way rather than after 3s
    setTimeout(() => {
      const config = {
        attributes: true,
        childList: true,
        // subtree: true,
      }

      const timeline = timelineSelector()
      console.debug('hongSeonbiTranslator:timeline', timeline)
      const observer = new MutationObserver(hongSeonbiMutation)
      console.debug('hongSeonbiTranslator:observer', observer)
      observer.observe(timeline, config)
    }, timeout)
  } catch (error) {
    console.error('hongSeonbiTranslator', error)
    throw error
  }
}

// Apply hongSeonbiTranslator with custom event listener
hongSeonbiTranslator()
window.addEventListener('locationchange', () => {
  console.debug(
    'window.addEventListener.locationchange',
    document.location.pathname
  )
  const targetPath = ['/home', '/hong2tu4', '/salgujelly', '/channprj']
  if (targetPath.includes(document.location.pathname)) {
    hongSeonbiTranslator()
  }
})
// window.onpopstate = (event) => {
//   const targetPath = ['/home', '/hong2tu4', '/salgujelly', '/channprj']
//   if (targetPath.includes(document.location.pathname)) {
//     hongSeonbiTranslator(200)
//   }
// }
// TODO: Change failover for timeline selector and MutationObserver
// let timer = null
// window.addEventListener(
//   'scroll',
//   (event) => {
//     if (timer !== null) {
//       clearTimeout(timer)
//     }
//     timer = setTimeout(function () {
//       hongSeonbiTranslator()
//     }, 150)
//   },
//   false
// )
