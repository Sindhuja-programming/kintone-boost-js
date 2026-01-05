window.addEventListener('load', function () {
    'use strict';

    const parentNode = document.body;
    const config = { childList: true, subtree: true };
    let currentType = '';

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

            // ジャンパー / 防寒ベスト → keyword search
            if (currentType === 'ジャンパー' || currentType === '防寒ベスト') {
                sizeInput.value = currentType;
                searchBtn.click();
                return;
            }

            // 空調服 → open lookup, then filter rows
            if (currentType === '空調服') {
                sizeInput.value = currentType;
                searchBtn.click();
                return;
            }

            // Default
            sizeInput.value = '';
            searchBtn.click();
        });
    }

    /* =========================
       Filter lookup rows (空調服 only)
    ========================= */
    function filterAirClothRows() {
        if (currentType !== '空調服') return;

        const dialog = document.querySelector('.kb-dialog-container');
        if (!dialog) return;

        const rows = dialog.querySelectorAll('tbody tr');
        if (!rows.length) return;

        rows.forEach(row => {
            const text = row.textContent.replace(/\s+/g, ' ').trim();

            // Remove ジャンパー / 防寒ベスト
            if (text.includes('ジャンパー') || text.includes('防寒ベスト')) {
                row.style.display = 'none';
                return;
            }

            // Allow only 空調服-related items
            const allow =
                text.includes('ファンセット付') ||
                text.includes('ベストのみ') ||
                text.includes('ファンセットのみ');

            row.style.display = allow ? '' : 'none';
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

        dialogObserver = new MutationObserver(filterAirClothRows);

        dialogObserver.observe(dialog, {
            childList: true,
            subtree: true
        });

        filterAirClothRows();
    }

    /* =========================
       Main observer
    ========================= */
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(elem => {
                if (elem.nodeType !== Node.ELEMENT_NODE) return;

                // Form row
                if (elem.querySelector && elem.querySelector('[field-id="種類"]')) {
                    const row =
                        elem.querySelector('tr') ||
                        elem.closest('tr') ||
                        elem;
                    bindEvent(row);
                }

                // Lookup dialog opened
                if (elem.classList && elem.classList.contains('kb-dialog-container')) {
                    setTimeout(observeLookupDialog, 50);
                }

                // Table body rendered
                if (elem.tagName === 'TBODY') {
                    setTimeout(filterAirClothRows, 50);
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
