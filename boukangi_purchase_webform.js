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

            if (!selectedType || selectedType === '----') {
                sizeField.value = '';
            } else {
                // ジャンパー / 防寒ベスト / 空調服
                sizeField.value = selectedType;
            }

            lookupBtn.dispatchEvent(new Event('click'));
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
