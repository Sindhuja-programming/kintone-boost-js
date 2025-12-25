window.addEventListener('load', function () {
  'use strict';

  const observerConfig = { childList: true, subtree: true };

  function bindLookupEvent(lookupArea) {
    const selectEl = lookupArea.querySelector('select');
    if (!selectEl || selectEl.dataset.bound === 'true') return;

    selectEl.dataset.bound = 'true';

    selectEl.addEventListener('change', function () {

      // selected lookup text
      const textSpan = lookupArea.querySelector('span');
      if (!textSpan) return;

      let selectedValue = textSpan.textContent.trim();
      selectedValue = selectedValue.split('（')[0].trim();

      // サイズ field input
      const sizeInput = document.querySelector(
        '[data-field-code="サイズ"] input'
      );
      if (!sizeInput) return;

      sizeInput.value = selectedValue;

      // trigger lookup search
      const searchBtn = lookupArea.querySelector(
        '.kb-icon-lookup.kb-search'
      );
      if (searchBtn) {
        searchBtn.click();
      }
    });
  }

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.querySelector &&
          node.querySelector('[data-field-code="種類"]')
        ) {
          bindLookupEvent(node);
        }
      });
    });
  });

  observer.observe(document.body, observerConfig);
});
