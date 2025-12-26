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
            currentSelectedType = selectedType; // Store current selection
            
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
            return;
        }
        
        const tableRows = lookupDialog.querySelectorAll('tbody tr');
        if (tableRows.length === 0) {
            return;
        }
        
        const allowedPrefixes = clothTypeSizeMapping[clothType] || [];
        
        if (!clothType || clothType === '----') {
            // Show all
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
            
            // Hide completely empty rows
            if (rowText === '' || rowText.length === 0) {
                row.style.display = 'none';
                return;
            }
            
            // For 空調服, show only 空調服 related items
            if (clothType === '空調服') {
                // Check if row starts with ジャンパー or 防寒ベスト (hide these)
                if (rowText.startsWith('ジャンパー') || rowText.startsWith('防寒ベスト')) {
                    row.style.display = 'none';
                    return;
                }
                
                // Show only if starts with allowed prefixes for 空調服
                let shouldShow = false;
                for (let i = 0; i < allowedPrefixes.length; i++) {
                    if (rowText.startsWith(allowedPrefixes[i])) {
                        shouldShow = true;
                        break;
                    }
                }
                
                row.style.display = shouldShow ? '' : 'none';
            } else {
                // For ジャンパー and 防寒ベスト
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
    
    // Observer specifically for lookup dialog table changes
    let dialogObserver = null;
    
    function observeDialogTable() {
        const lookupDialog = document.querySelector('.kb-dialog-container');
        if (!lookupDialog) return;
        
        // Disconnect previous observer if exists
        if (dialogObserver) {
            dialogObserver.disconnect();
        }
        
        // Create new observer for the dialog
        dialogObserver = new MutationObserver(function(mutations) {
            // Filter table whenever content changes
            if (currentSelectedType === '空調服') {
                filterLookupTable(currentSelectedType);
            }
        });
        
        // Observe the dialog for any changes
        dialogObserver.observe(lookupDialog, { 
            childList: true, 
            subtree: true,
            characterData: true
        });
        
        // Apply initial filter
        if (currentSelectedType === '空調服') {
            filterLookupTable(currentSelectedType);
        }
    }
    
    // Main observer for dynamically added elements
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
                    setTimeout(function() {
                        observeDialogTable();
                    }, 50);
                }
                
                // Also check if tbody is added to existing dialog
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
        bindKindaChange(existingKinda.closest('tr') || existingKinda.closest('div') || document.body);
    }
});
