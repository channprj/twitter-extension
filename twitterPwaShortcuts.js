// ==UserScript==
// @name         Twitter PWA Shortcuts Extension
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Twitter PWA Shortcuts Extension
// @author       CHANN <chann@chann.kr>
// @match        http*://twitter.com/*
// @run-at       document-end
// ==/UserScript==

// TODO
const observer = new MutationObserver(mutations => {});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

window.addEventListener("keyup", event => {
  event = event || window.event;
  const keyCode = event.code;
  // console.log(`keyup: ${keyCode}`);

  const popupMenu = document.querySelector("[role=presentation]");
  const closeBtn = document.querySelector("[aria-label=Close]");
  const backBtn = document.querySelector("[aria-label=Back]");
  if (keyCode === "Escape") {
    if (popupMenu !== null) {
      popupMenu.remove();
      return;
    } else if (closeBtn !== null) {
      closeBtn.click();
      console.log("[ closeBtn ]");
      return;
    } else if (backBtn !== null) {
      backBtn.click();
      console.log("[ backBtn ]");
      return;
    }
  }
});
window.removeEventListener("keyup");
