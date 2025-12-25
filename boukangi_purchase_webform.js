window.addEventListener('load', function () {
    const DATA = {
        "ジャンパー": ["ジャンパー　S", "ジャンパー　M", "ジャンパー　L", "ジャンパー　2L", "ジャンパー　3L"],
        "防寒ベスト": ["防寒ベスト　M", "防寒ベスト　L", "防寒ベスト　2L", "防寒ベスト　3L", "防寒ベスト　4L", "防寒ベスト　5L"],
        "空調服": ["ファンセット付　S", "ファンセット付　M", "ファンセット付　L", "ファンセット付　2L", "ファンセット付　3L", "ベストのみ　S", "ベストのみ　M", "ベストのみ　L", "ベストのみ　2L", "ベストのみ　3L", "ファンセットのみ"]
    };

    const parentNode = document.body;
    const config = { childList: true, subtree: true };

    function addEvent(node) {
        const typeSelect = node.querySelector('[field-id="種類"] select');
        const sizeInput = node.querySelector('[field-id="サイズ"] input');

        if (!typeSelect || !sizeInput) return;

        typeSelect.addEventListener('change', function () {
            const type = this.value;
            if (!DATA[type]) {
                sizeInput.value = '';
                return;
            }

            // Take first option by default
            sizeInput.value = DATA[type][0];

            // Trigger click on lookup/search if needed
            const searchBtn = node.querySelector('.kb-icon.kb-icon-lookup.kb-search');
            if (searchBtn) {
                searchBtn.click();
            }
        });
    }

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(elem => {
                if (elem.nodeType === Node.ELEMENT_NODE && elem.querySelector('[field-id="種類"]')) {
                    addEvent(elem);
                }
            });
        });
    });

    observer.observe(parentNode, config);
});
