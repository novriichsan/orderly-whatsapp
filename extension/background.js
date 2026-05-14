// Background service worker
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) await chrome.sidePanel.open({ tabId: tab.id });
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(() => {});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "WA_IMPORT_MESSAGE") {
    chrome.storage.local.set({ pendingImport: msg.text, pendingImportAt: Date.now() }, () => {
      // Try to open sidepanel for the active tab
      if (sender.tab?.id) {
        chrome.sidePanel.open({ tabId: sender.tab.id }).catch(() => {});
      }
      sendResponse({ ok: true });
    });
    return true;
  }
});
