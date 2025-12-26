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
            
            // Set lookup filter value
            if (!selectedType || selectedType === '----') {
                // Show all cloth types
                sizeField.value = '';
                lookupBtn.dispatchEvent(new Event('click'));
            } else if (selectedType === '空調服') {
                // For 空調服, clear search and filter manually
                sizeField.value = '';
                lookupBtn.dispatchEvent(new Event('click'));
                
                // Filter the lookup table after it opens
                setTimeout(function() {
                    filterLookupTable('空調服');
                }, 300);
            } else {
                // For ジャンパー and 防寒ベスト, search normally
                sizeField.value = selectedType;
                lookupBtn.dispatchEvent(new Event('click'));
            }
        });
    }
    
    function filterLookupTable(clothType) {
        const lookupDialog = document.querySelector('.kb-dialog-container');
        if (!lookupDialog) {
            console.log('Lookup dialog not found');
            return;
        }
        
        const tableRows = lookupDialog.querySelectorAll('tbody tr');
        const allowedPrefixes = clothTypeSizeMapping[clothType] || [];
        
        if (allowedPrefixes.length === 0) {
            // Show all if no mapping (when ---- is selected)
            tableRows.forEach(row => row.style.display = '');
            return;
        }
        
        tableRows.forEach(function(row) {
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) {
                // Hide empty rows
                row.style.display = 'none';
                return;
            }
            
            let rowText = '';
            cells.forEach(cell => {
                rowText += cell.textContent.trim() + ' ';
            });
            
            rowText = rowText.trim();
            
            // Hide completely empty rows
            if (rowText === '' || rowText.length === 0) {
                row.style.display = 'none';
                return;
            }
            
            // For 空調服, exclude ジャンパー and 防寒ベスト
            if (clothType === '空調服') {
                // Hide if starts with ジャンパー or 防寒ベスト
                if (rowText.startsWith('ジャンパー') || rowText.startsWith('防寒ベスト')) {
                    row.style.display = 'none';
                    return;
                }
                
                // Show if starts with any 空調服 prefix
                let shouldShow = false;
                for (let i = 0; i < allowedPrefixes.length; i++) {
                    if (rowText.startsWith(allowedPrefixes[i])) {
                        shouldShow = true;
                        break;
                    }
                }
                
                row.style.display = shouldShow ? '' : 'none';
            } else {
                // For other types, check if row starts with allowed prefix
                let shouldShow = false;
                for (let i = 0; i < allowedPrefixes.length; i++) {
                    if (rowText.startsWith(allowedPrefixes[i])) {
                        shouldShow = true;
                        break;
                    }
                }
                
                row.style.display = shouldShow ? '' : 'none';
            }
        });
    }
    
    // Observer for dynamically added elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                
                // Bind to record form row
                if (node.querySelector && node.querySelector('[field-id="種類"]')) {
                    bindKindaChange(node);
                }
                
                // Watch for lookup dialog appearance
                if (node.classList && node.classList.contains('kb-dialog-container')) {
                    // Check which cloth type is selected
                    const kindaSelect = document.querySelector('[field-id="種類"] select');
                    if (kindaSelect && kindaSelect.value === '空調服') {
                        setTimeout(function() {
                            filterLookupTable('空調服');
                        }, 100);
                    }
                }
            });
        });
    });
    
    observer.observe(parentNode, config);
    
    // Bind to existing form if already loaded
    const existingKinda = document.querySelector('[field-id="種類"]');
    if (existingKinda) {
        bindKindaChange(existingKinda.closest('tr') || existingKinda.closest('div') || document.body);
    }
});
