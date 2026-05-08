// Service Worker: opens camera UI as a real Chrome window
// (Extension popups auto-close when they lose focus → dismisses camera permission dialog)

chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",      // Chrome window — stays open even when permission dialog appears
    width: 440,
    height: 620,
    focused: true
  });
});
