window.addEventListener('load', function () {
    'use strict';

    const parentNode = document.body;
    const config = { childList: true, subtree: true };

    // Cloth type → allowed size prefixes
    const clothTypeSizeMapping = {
        'ジャンパー': ['ジャンパー'],
        '防寒ベスト': ['防寒ベスト'],
        '空調服': ['ファンセット付', 'ベストのみ', 'ファンセットのみ']
    };

    let currentSelectedType = '';

    /* =========================
       Bind 種類 dropdown change
    ========================= */
    function bindKindaChange(container) {
        const kindaSelect = container.querySelector('[field-id="種類"] select');
        if (!kindaSelect || kindaSelect.dataset.bound) return;

        kindaSelect.dataset.bound = 'true';

        kindaSelect.addEventListener('change', function () {
            currentSelectedType = kindaSelect.value;

            const sizeField = container.querySelector('[field-id="サイズ"] input');
            const lookupBtn = container.querySelector(
                '[field-id="サイズ"] .kb-icon-lookup.kb-search'
            );

            if (!sizeField || !lookupBtn) return;

            if (!currentSelectedType || currentSelectedType === '----') {
                sizeField.value = '';
                lookupBtn.dispatchEvent(new Event('click'));
                return;
            }

            if (currentSelectedType === '空調服') {
                // IMPORTANT: do not set search text
                sizeField.value = '';
            } else {
                // Use built-in lookup filtering
                sizeField.value = currentSelectedType;
            }

            lookupBtn.dispatchEvent(new Event('click'));
        });
    }

    /* =========================
       Filter lookup table rows
    ========================= */
    function filterLookupTable(clothType) {
        const lookupDialog = document.querySelector('.kb-dialog-container');
        if (!lookupDialog) return;

        const tableRows = lookupDialog.querySelectorAll('tbody tr');
        if (!tableRows.length) return;

        const allowedPrefixes = clothTypeSizeMapping[clothType] || [];

        if (!clothType || clothType === '----') {
            tableRows.forEach(row => row.style.display = '');
            return;
        }

        tableRows.forEach(row => {
            const rowText = row.innerText.trim();
            if (!rowText) {
                row.style.display = 'none';
                return;
            }

            // ✅ Special strict filtering for 空調服
            if (clothType === '空調服') {
                // Explicitly hide ジャンパー & 防寒ベスト
                if (
                    rowText.startsWith('ジャンパー') ||
                    rowText.startsWith('防寒ベスト')
                ) {
                    row.style.display = 'none';
                    return;
                }

                // Show ONLY the three 空調服 types
                const shouldShow = allowedPrefixes.some(prefix =>
                    rowText.startsWith(prefix)
                );

                row.style.display = shouldShow ? '' : 'none';
                return;
            }

            // ✅ Normal filtering for ジャンパー / 防寒ベスト
            const shouldShow = allowedPrefixes.some(prefix =>
                rowText.startsWith(prefix)
            );

            row.style.display = shouldShow ? '' : 'none';
        });
    }

    /* =========================
       Observe lookup dialog
    ========================= */
    let dialogObserver = null;

    function observeDialogTable() {
        const lookupDialog = document.querySelector('.kb-dialog-container');
        if (!lookupDialog) return;

        if (dialogObserver) {
            dialogObserver.disconnect();
        }

        dialogObserver = new MutationObserver(() => {
            filterLookupTable(currentSelectedType);
        });

        dialogObserver.observe(lookupDialog, {
            childList: true,
            subtree: true,
            characterData: true
        });

        filterLookupTable(currentSelectedType);
    }

    /* =========================
       Global observer
    ========================= */
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                if (node.querySelector && node.querySelector('[field-id="種類"]')) {
                    bindKindaChange(node);
                }

                if (node.classList && node.classList.contains('kb-dialog-container')) {
                    setTimeout(observeDialogTable, 50);
                }

                if (node.tagName === 'TBODY') {
                    const dialog = node.closest('.kb-dialog-container');
                    if (dialog) {
                        setTimeout(() => {
                            filterLookupTable(currentSelectedType);
                        }, 50);
                    }
                }
            });
        });
    });

    observer.observe(parentNode, config);

    /* ==*
