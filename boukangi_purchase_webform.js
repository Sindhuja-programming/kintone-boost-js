window.addEventListener('load', function () {
    'use strict';

    const parentNode = document.body;
    const config = { childList: true, subtree: true };

    function filterAirRows() {
        const rows = document.querySelectorAll('.gaia-argoui-table tbody tr');

        rows.forEach(row => {
            const text = row.innerText.trim();

            if (
                text.startsWith('ファンセット付') ||
                text.startsWith('ベストのみ') ||
                text.startsWith('ファンセットのみ')
            ) {
                row.style.display = '';
            } else {
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

            if (!selectedType || selectedType === '----') {
                sizeField.value = '';
                lookupBtn.click();
                return;
            }

            if (selectedType === '空調服') {
                // Open lookup WITHOUT filter
                sizeField.value = '';
                lookupBtn.click();

                // Wait for lookup table to render, then filter rows
                setTimeout(filterAirRows, 300);
                return;
            }

            // ジャンパー / 防寒ベスト
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
