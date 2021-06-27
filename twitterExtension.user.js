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

// Utils
// ------------------------------------------------------------
const fetchRetry = (url, options = {}, retries) =>
  fetch(url, options)
    .then((res) => {
      console.debug('fetchRetry', res)
      if (res.ok) {
        return res.json()
      }
      if (retries > 0) {
        return fetchRetry(url, options, retries - 1)
      }
      throw new Error(res.status)
    })
    .catch((error) => console.error('fetchRetry:error', error.message))

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
        let contentSelector =
          'div > div > article > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:first-child > div'
        // Reassign the author selector for target user timeline
        const targetUserTimeline = ['/hongminhee', '/hong2tu4', '/salgujelly']
        if (targetUserTimeline.includes(document.location.pathname)) {
          authorSelector =
            'div > div > article > div > div > div > div:nth-child(2) > div:nth-child(2) > div:first-child > div > div > div:first-child > div:first-child > a'
        }
        const authorLink = tweet.querySelector(authorSelector)
        const content = tweet.querySelector(contentSelector)
        // console.debug('authorLink', authorLink)
        if (authorLink) {
          let username = authorLink.getAttribute('href').split('/')[1]
          const seonbiUser = ['hongminhee', 'hong2tu4', 'channprj']
          const targetUsers = [
            'hongminhee',
            'hong2tu4',
            'salgujelly',
            // Test users (night owl)
            // --------------------
            'channprj',
            // 'BBCWorld',
            // 'CNN',
            // 'cnnbrk',
            // 'F1',
            // 'resten1497',
            // 'blurfxo',
            // 'nameEO',
            // 'haruair',
            // 'shiftpsh',
            // '_jeyraof',
            // 'lqez',
            // --------------------
          ]
          // Translate with seonbi
          if (seonbiUser.includes(username)) {
            // TODO: Translate with seonbi
            // TODO: Bypass Twitter CSP
            // let headers = new Headers()
            // headers.append('Content-Type', 'application/json')
            // let body = JSON.stringify({
            //   preset: 'ko-kr',
            //   sourceHtml: content.innerText,
            // })

            // let requestOptions = {
            //   method: 'POST',
            //   headers,
            //   body,
            //   redirect: 'follow',
            // }
            // fetchRetry('https://seonbi.herokuapp.com/', requestOptions, 3).then(
            //   (response) => {
            //     const result = response.json()
            //     var translated = document.createElement('span')
            //     translated.innerText = '\n\n' + result.resultHtml
            //     content.appendChild(translated)
            //   }
            // )
            // TODO: Append buttons continuously; Do not append if exists
            var translated = document.createElement('button')
            translated.innerText = '번역'
            content.appendChild(translated)

            content.style.color = 'blue'
          }

          // Change name and color
          if (targetUsers.includes(username)) {
            let nameElem = authorLink.querySelector(
              'div > div:first-child > div:first-child > span > span'
            )
            if (username === 'salgujelly') {
              nameElem.textContent = `🐰 ${username} 🎩`
            } else {
              nameElem.textContent = `🎩 ${username} 🐰`
            }
            nameElem.style.color = 'pink'
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
