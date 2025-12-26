window.addEventListener('load', function () {
    'use strict';

    const parentNode = document.body;
    const config = { childList: true, subtree: true };

    function filterAirRows() {
        const rows = document.querySelectorAll('.gaia-argoui-table tbody tr');

        rows.forEach(row => {
            const text = row.innerText.replace(/\s+/g, ' ').trim();

            // Hide empty rows
            if (!text) {
                row.style.display = 'none';
                return;
            }

            // Show ONLY 空調服-related rows
            const isAir =
                text.includes('ファンセット付') ||
                text.includes('ベストのみ') ||
                text.includes('ファンセットのみ');

            if (isAir) {
                row.style.display = '';
            } else {
                // Hide ジャンパー / 防寒ベスト / others
                row.style.display = 'none';
            }
        });
    }

    function bindKindaChange(container) {
        const kindaSelect = container.querySelector('[field-id="種類"] select');
        if (!kindaSelect || kindaSelect.dataset.bound) return;

        kindaSelect.dataset.bound = 'true';

        kindaSelect.addEventListener('change', function () {
            const selectedType = kindaSelect.value;

            const sizeField = container.querySelector('[field-id="サイズ"] input');
            const lookupBtn = container.querySelector(
                '[field-id="サイズ"] .kb-icon-lookup.kb-search'
            );

            if (!sizeField || !lookupBtn) return;

            // ---- Blank (----) → show all ----
            if (!selectedType || selectedType === '----') {
                sizeField.value = '';
                lookupBtn.click();
                return;
            }

            // ---- 空調服 → open all, then strictly filter ----
            if (selectedType === '空調服') {
                sizeField.value = '';
                lookupBtn.click();

                // Wait for lookup dialog render
                setTimeout(filterAirRows, 350);
                return;
            }

            // ---- ジャンパー / 防寒ベスト ----
            sizeField.value = selectedType;
            lookupBtn.click();
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                if (node.querySelector && node.querySelector('[field-id="種類"]')) {
                    bindKindaChange(node);
                }
            });
        });
    });

    observer.observe(parentNode, config);
});
