// This is a content script, meaning it can interact with the user's current web page.
// This specific one allows us to extract the text content of the current page for AI Autofill.
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

console.log("Content script loaded")
console.log("[CONTENT] Loaded on:", location.href)

function getSanitizedPageText(): string {
  const rawText = document.body.innerText || ""

  return rawText
    .replace(/\t/g, "  ")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "GET_PAGE_TEXT") {
    return
  }

  console.log("[CONTENT] GET_PAGE_TEXT received")

  sendResponse({
    text: getSanitizedPageText(),
    url: window.location.href
  })

  return true
})