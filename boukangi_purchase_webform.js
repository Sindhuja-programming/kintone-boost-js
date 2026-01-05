window.addEventListener('load', function () {
    'use strict';
    
    const parentNode = document.body;
    const config = { childList: true, subtree: true };
    
    // Mapping for cloth types to their actual size prefixes
    const clothTypeSizeMapping = {
        'ジャンパー': ['ジャンパー'],
        '防寒ベスト': ['防寒ベスト'],
        '空調服': ['ファンセット付', 'ベストのみ', 'ファンセットのみ']
    };
    
    let currentSelectedType = '';
    
    function bindKindaChange(container) {
        const kindaSelect = container.querySelector('[field-id="種類"] select');
        if (!kindaSelect || kindaSelect.dataset.bound) return;
        kindaSelect.dataset.bound = 'true';
        
        kindaSelect.addEventListener('change', function () {
            const selectedType = kindaSelect.value;
            currentSelectedType = selectedType;
            
            const sizeField = container.querySelector('[field-id="サイズ"] input');
            const lookupBtn = container.querySelector(
                '[field-id="サイズ"] .kb-icon-lookup.kb-search'
            );
            
            if (!sizeField || !lookupBtn) return;
            
            if (!selectedType || selectedType === '----') {
                sizeField.value = '';
                lookupBtn.dispatchEvent(new Event('click'));
            } else if (selectedType === '空調服') {
                sizeField.value = '';
                lookupBtn.dispatchEvent(new Event('click'));
            } else {
                sizeField.value = selectedType;
                lookupBtn.dispatchEvent(new Event('click'));
            }
        });
    }
    
    function filterLookupTable(clothType) {
        const lookupDialog = document.querySelector('.kb-dialog-container');
        if (!lookupDialog) return;
        
        const tableRows = lookupDialog.querySelectorAll('tbody tr');
        if (tableRows.length === 0) return;
        
        const allowedPrefixes = clothTypeSizeMapping[clothType] || [];
        
        if (!clothType || clothType === '----') {
            tableRows.forEach(row => row.style.display = '');
            return;
        }
        
        tableRows.forEach(function(row) {
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) {
                row.style.display = 'none';
                return;
            }
            
            let rowText = '';
            cells.forEach(cell => {
                rowText += cell.textContent.trim() + ' ';
            });
            rowText = rowText.trim();
            
            if (rowText === '') {
                row.style.display = 'none';
                return;
            }
            
            /* ===== FIXED 空調服 LOGIC ===== */
            if (clothType === '空調服') {
                // Block other cloth types explicitly
                if (rowText.includes('ジャンパー') || rowText.includes('防寒ベスト')) {
                    row.style.display = 'none';
                    return;
                }
                
                // Allow ONLY 空調服-related sizes
                const shouldShow =
                    rowText.includes('ファンセット付') ||
                    rowText.includes('ベストのみ') ||
                    rowText.includes('ファンセットのみ');
                
                row.style.display = shouldShow ? '' : 'none';
                return;
            }
            /* ===== END FIX ===== */
            
            // Existing logic for ジャンパー / 防寒ベスト (unchanged)
            let shouldShow = false;
            for (let i = 0; i < allowedPrefixes.length; i++) {
                if (rowText.startsWith(allowedPrefixes[i])) {
                    shouldShow = true;
                    break;
                }
            }
            
            row.style.display = shouldShow ? '' : 'none';
        });
    }
    
    // Observer specifically for lookup dialog table changes
    let dialogObserver = null;
    
    function observeDialogTable() {
        const lookupDialog = document.querySelector('.kb-dialog-container');
        if (!lookupDialog) return;
        
        if (dialogObserver) {
            dialogObserver.disconnect();
        }
        
        dialogObserver = new MutationObserver(function() {
            if (currentSelectedType === '空調服') {
                filterLookupTable(currentSelectedType);
            }
        });
        
        dialogObserver.observe(lookupDialog, { 
            childList: true, 
            subtree: true,
            characterData: true
        });
        
        if (currentSelectedType === '空調服') {
            filterLookupTable(currentSelectedType);
        }
    }
    
    // Main observer for dynamically added elements
    const observer = new MutationObserver((mutations) => {
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
                    if (dialog && currentSelectedType === '空調服') {
                        setTimeout(function() {
                            filterLookupTable(currentSelectedType);
                        }, 50);
                    }
                }
            });
        });
    });
    
    observer.observe(parentNode, config);
    
    // Bind to existing form if already loaded
    const existingKinda = document.querySelector('[field-id="種類"]');
    if (existingKinda) {
        const select = existingKinda.querySelector('select');
        if (select) {
            currentSelectedType = select.value;
        }
        bindKindaChange(
            existingKinda.closest('tr') ||
            existingKinda.closest('div') ||
            document.body
        );
    }
});
