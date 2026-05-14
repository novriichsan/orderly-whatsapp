// WhatsApp Web content script — inject "Import Order" button on hover
(function () {
  const BUTTON_ID = "lov-import-order-btn";
  let currentBubble = null;
  let hideTimer = null;

  function getMessageText(bubble) {
    const span = bubble.querySelector("span.selectable-text");
    if (span) return span.innerText.trim();
    return bubble.innerText.trim();
  }

  function ensureButton() {
    let btn = document.getElementById(BUTTON_ID);
    if (btn) return btn;
    btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:6px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        Import Order
      </span>`;
    btn.className = "lov-import-btn";
    btn.style.position = "absolute";
    btn.style.zIndex = "9999";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!currentBubble) return;
      const text = getMessageText(currentBubble);
      chrome.runtime.sendMessage({ type: "WA_IMPORT_MESSAGE", text }, () => {
        btn.classList.add("lov-imported");
        btn.innerText = "✓ Imported";
        setTimeout(() => hideButton(), 900);
      });
    });
    document.body.appendChild(btn);
    return btn;
  }

  function showButtonForBubble(bubble) {
    currentBubble = bubble;
    const rect = bubble.getBoundingClientRect();
    const btn = ensureButton();
    btn.style.top = window.scrollY + rect.top - 32 + "px";
    btn.style.left = window.scrollX + rect.right - 130 + "px";
    btn.classList.remove("lov-imported");
    btn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
      Import Order
    </span>`;
    btn.classList.add("lov-visible");
  }

  function hideButton() {
    const btn = document.getElementById(BUTTON_ID);
    if (btn) btn.classList.remove("lov-visible");
    currentBubble = null;
  }

  document.addEventListener("mouseover", (e) => {
    const bubble = e.target.closest('div.message-in, div.message-out, [data-id^="false_"], [data-id^="true_"]');
    if (!bubble) return;
    clearTimeout(hideTimer);
    showButtonForBubble(bubble);
  });

  document.addEventListener("mouseout", (e) => {
    const goingTo = e.relatedTarget;
    if (goingTo && (goingTo.id === BUTTON_ID || goingTo.closest?.("#" + BUTTON_ID))) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideButton, 250);
  });
})();
