window.addEventListener('load', function () {
    'use strict';

    const parentNode = document.body;
    const config = { childList: true, subtree: true };

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

            // ---- FIX STARTS HERE (空調服 only) ----
            if (selectedType === '空調服') {
                const airTypes = ['ファンセット付', 'ベストのみ', 'ファンセットのみ'];

                // clear first
                sizeField.value = '';
                lookupBtn.dispatchEvent(new Event('click'));

                // search each variety
                airTypes.forEach(type => {
                    sizeField.value = type;
                    lookupBtn.dispatchEvent(new Event('click'));
                });

            } else if (!selectedType || selectedType === '----') {
                // show all
                sizeField.value = '';
                lookupBtn.dispatchEvent(new Event('click'));

            } else {
                // ジャンパー / 防寒ベスト
                sizeField.value = selectedType;
                lookupBtn.dispatchEvent(new Event('click'));
            }
            // ---- FIX ENDS HERE ----
        });
    }

    const observer = new MutationObserver((mutations) => {
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
