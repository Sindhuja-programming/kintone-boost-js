window.addEventListener('load', function () {
    'use strict';

    const parentNode = document.body;
    const config = { childList: true, subtree: true };
    let currentType = '';

    /* =========================
       Universal row filter
    ========================= */
    function filterRows() {
        if (!currentType) return;

        const dialog = document.querySelector('.kb-dialog-container');
        if (!dialog) return;

        const rows = dialog.querySelectorAll('tbody tr');
        if (!rows.length) return;

        rows.forEach(row => {
            const text = row.innerText.trim();

            if (currentType === 'ジャンパー') {
                row.style.display = text.startsWith('ジャンパー') ? '' : 'none';

            } else if (currentType === '防寒ベスト') {
                row.style.display = text.startsWith('防寒ベスト') ? '' : 'none';

            } else if (currentType === '空調服') {
                // Items in DB start with "空調服ファンセット付"
                row.style.display = text.startsWith('空調服') ? '' : 'none';

            } else {
                row.style.display = '';
            }
        });
    }

    /* =========================
       Bind 種類 change
    ========================= */
    function bindEvent(node) {
        const typeSelect = node.querySelector('[field-id="種類"] select');
        if (!typeSelect || typeSelect.dataset.bound) return;
        typeSelect.dataset.bound = 'true';

        typeSelect.addEventListener('change', function () {
            currentType = typeSelect.value;

            const sizeInput = node.querySelector('[field-id="サイズ"] input');
            const searchBtn = node.querySelector(
                '[field-id="サイズ"] .kb-icon-lookup.kb-search'
            );

            if (!sizeInput || !searchBtn) return;

            // Clear input and open lookup — filterRows() will handle visibility
            sizeInput.value = '';
            searchBtn.click();
        });
    }

    /* =========================
       Observe lookup dialog
    ========================= */
    let dialogObserver = null;

    function observeLookupDialog() {
        const dialog = document.querySelector('.kb-dialog-container');
        if (!dialog) return;

        if (dialogObserver) dialogObserver.disconnect();

        dialogObserver = new MutationObserver(() => {
            filterRows();
        });

        dialogObserver.observe(dialog, { childList: true, subtree: true });

        // Run immediately on open
        filterRows();
    }

    /* =========================
       Main observer
    ========================= */
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(elem => {
                if (elem.nodeType !== Node.ELEMENT_NODE) return;

                // Bind 種類 dropdown
                if (elem.querySelector && elem.querySelector('[field-id="種類"]')) {
                    const row =
                        elem.querySelector('tr') ||
                        elem.closest('tr') ||
                        elem;
                    bindEvent(row);
                }

                // Dialog opened
                if (elem.classList && elem.classList.contains('kb-dialog-container')) {
                    setTimeout(observeLookupDialog, 50);
                }

                // Table body re-rendered (pagination, search)
                if (elem.tagName === 'TBODY') {
                    setTimeout(filterRows, 50);
                }
            });
        });
    });

    observer.observe(parentNode, config);

    /* =========================
       Initial bind
    ========================= */
    const existing = document.querySelector('[field-id="種類"] select');
    if (existing) {
        currentType = existing.value;
        bindEvent(
            existing.closest('tr') ||
            existing.closest('div') ||
            document.body
        );
    }
});
