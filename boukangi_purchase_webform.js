window.addEventListener('load', function () {
    'use strict';

    const parentNode = document.body;

    // Exact prefix mapping (matches your data)
    const clothTypePrefixes = {
        'ジャンパー': ['ジャンパー'],
        '防寒ベスト': ['防寒ベスト'],
        '空調服': ['ファンセット付', 'ベストのみ', 'ファンセットのみ']
    };

    let currentType = '';

    /* =========================
       Bind 種類 dropdown
    ========================= */
    function bindTypeChange(container) {
        const select = container.querySelector('[field-id="種類"] select');
        if (!select || select.dataset.bound) return;

        select.dataset.bound = 'true';

        select.addEventListener('change', function () {
            currentType = select.value;

            const sizeInput = container.querySelector('[field-id="サイズ"] input');
            const lookupBtn = container.querySelector(
                '[field-id="サイズ"] .kb-icon-lookup.kb-search'
            );

            if (!sizeInput || !lookupBtn) return;

            // Always open lookup freshly
            sizeInput.value = '';
            lookupBtn.click();
        });
    }

    /* =========================
       Filter lookup table
    ========================= */
    function filterLookupTable() {
        const dialog = document.querySelector('.kb-dialog-container');
        if (!dialog) return;

        const rows = dialog.querySelectorAll('tbody tr');
        if (!rows.length) return;

        const prefixes = clothTypePrefixes[currentType];

        // No selection → show all
        if (!prefixes || prefixes.length === 0) {
            rows.forEach(row => row.style.display = '');
            return;
        }

        rows.forEach(row => {
            const text = row.textContent.replace(/\s+/g, ' ').trim();

            const match = prefixes.some(prefix =>
                text.startsWith(prefix)
            );

            row.style.display = match ? '' : 'none';
        });
    }

    /* =========================
       Observe lookup dialog
    ========================= */
    let dialogObserver = null;

    function observeDialog() {
        const dialog = document.querySelector('.kb-dialog-container');
        if (!dialog) return;

        if (dialogObserver) dialogObserver.disconnect();

        dialogObserver = new MutationObserver(filterLookupTable);

        dialogObserver.observe(dialog, {
            childList: true,
            subtree: true
        });

        filterLookupTable();
    }

    /* =========================
       Main observer
    ========================= */
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                // Bind 種類 field
                if (node.querySelector && node.querySelector('[field-id="種類"]')) {
                    bindTypeChange(node);
                }

                // Lookup dialog opened
                if (node.classList && node.classList.contains('kb-dialog-container')) {
                    setTimeout(observeDialog, 50);
                }

                // Table body rendered
                if (node.tagName === 'TBODY') {
                    setTimeout(filterLookupTable, 50);
                }
            });
        });
    });

    observer.observe(parentNode, { childList: true, subtree: true });

    /* =========================
       Initial binding
    ========================= */
    const existingSelect = document.querySelector('[field-id="種類"] select');
    if (existingSelect) {
        currentType = existingSelect.value;
        bindTypeChange(
            existingSelect.closest('tr') ||
            existingSelect.closest('div') ||
            document.body
        );
    }
});
