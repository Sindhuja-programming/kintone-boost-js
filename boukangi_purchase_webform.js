window.addEventListener('load', function () {
    'use strict';

    const parentNode = document.body;
    const config = { childList: true, subtree: true };

    // Cloth type → lookup keyword
    function getLookupKeyword(type) {
        if (type === 'ジャンパー') return 'ジャンパー';
        if (type === '防寒ベスト') return '防寒ベスト';
        return ''; // 空調服 handled separately
    }

    function bindEvent(node) {
        const typeSelect = node.querySelector('[field-id="種類"] select');
        if (!typeSelect || typeSelect.dataset.bound) return;
        typeSelect.dataset.bound = 'true';

        typeSelect.addEventListener('change', function () {
            const selectedType = typeSelect.value;

            const sizeInput = node.querySelector('[field-id="サイズ"] input');
            const searchBtn = node.querySelector(
                '[field-id="サイズ"] .kb-icon-lookup.kb-search'
            );

            if (!sizeInput || !searchBtn) return;

            /* =========================
               ジャンパー / 防寒ベスト
            ========================= */
            if (selectedType === 'ジャンパー' || selectedType === '防寒ベスト') {
                sizeInput.value = getLookupKeyword(selectedType);
                searchBtn.click();
                return;
            }

            /* =========================
               空調服
            ========================= */
            if (selectedType === '空調服') {
                // Open lookup without keyword (Kintone limitation)
                sizeInput.value = '';
                searchBtn.click();
                return;
            }

            // No selection → show all
            sizeInput.value = '';
            searchBtn.click();
        });
    }

    /* =========================
       Observe form creation
    ========================= */
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(elem => {
                if (elem.nodeType !== Node.ELEMENT_NODE) return;

                if (elem.querySelector && elem.querySelector('[field-id="種類"]')) {
                    const row =
                        elem.querySelector('tr') ||
                        elem.closest('tr') ||
                        elem;

                    bindEvent(row);
                }
            });
        });
    });

    observer.observe(parentNode, config);

    /* =========================
       Initial bind
    ========================= */
    const existing = document.querySelector('[field-id="種類"]');
    if (existing) {
        bindEvent(
            existing.closest('tr') ||
            existing.closest('div') ||
            document.body
        );
    }
});
