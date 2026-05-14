# Chrome Extension — WA Order Sidepanel

Manifest V3 Chrome extension that:

1. Injects a floating **"Import Order"** button on WhatsApp Web message bubbles (hover).
2. Captures the message text and opens the Chrome **Side Panel**.
3. Pre-fills the in-app `/import` route with the captured message so the parser
   can convert it to a draft order.

## Install

1. Build / publish the React app and note its URL.
2. Edit `sidepanel.html` and replace `__APP_URL__` with the published URL.
3. Open `chrome://extensions`, enable **Developer Mode**, click **Load unpacked**,
   and select this folder.
4. Visit `https://web.whatsapp.com`, hover any message, click **Import Order**.

## Files

- `manifest.json` — Manifest V3 declaration
- `background.js` — service worker handling messages and side panel
- `content.js` — DOM detection + hover button injection on WhatsApp Web
- `content.css` — premium animated styling for the floating button
- `sidepanel.html` — wrapper that loads the React app in an iframe
