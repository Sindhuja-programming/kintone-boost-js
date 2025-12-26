window.addEventListener('load', function () {
    'use strict';

    const parentNode = document.body;
    const config = { childList: true, subtree: true };
    let airObserver = null;

    function applyAirFilter(dialog) {
        const rows = dialog.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cellsText = Array.from(row.querySelectorAll('td'))
                .map(td => td.innerText.trim())
                .join(' ');

            const isAir =
                cellsText.includes('ファンセット付') ||
                cellsText.includes('ベストのみ') ||
                cellsText.includes('ファンセットのみ');

            if (isAir) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function observeLookupDialog() {
        const dialog = document.querySelector('.gaia-argoui-dialog, .lookup-gaia-dialog');
        if (!dialog || airObserver) return;

        airObserver = new MutationObserver(() => {
            applyAirFilter(dialog);
        });

        airObserver.observe(dialog, { childList: true, subtree: true });
        applyAirFilter(dialog);
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

            // ---- Blank ----
            if (!selectedType || selectedType === '----') {
                if (airObserver) {
                    airObserver.disconnect();
                    airObserver = null;
                }
                sizeField.value = '';
                lookupBtn.click();
                return;
            }

            // ---- 空調服 ----
            if (selectedType === '空調服') {
                sizeField.value = '';
                lookupBtn.click();

                // Observe lookup dialog continuously
                setTimeout(observeLookupDialog, 100);
                return;
            }

            // ---- ジャンパー / 防寒ベスト ----
            if (airObserver) {
                airObserver.disconnect();
                airObserver = null;
            }

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
