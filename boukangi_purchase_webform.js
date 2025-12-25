window.addEventListener('load', function () {
    const parentNode = document.body; // Observe whole page
    const config = { childList: true, subtree: true };

    // Cloth type → size mapping
    const SIZE_MAP = {
        "ジャンパー": ["ジャンパー S", "ジャンパー M", "ジャンパー L", "ジャンパー 2L", "ジャンパー 3L"],
        "防寒ベスト": ["防寒ベスト M", "防寒ベスト L", "防寒ベスト 2L", "防寒ベスト 3L", "防寒ベスト 4L", "防寒ベスト 5L"],
        "空調服": ["ファンセット付 S", "ファンセット付 M", "ファンセット付 L", "ファンセット付 2L", "ファンセット付 3L", "ベストのみ S", "ベストのみ M", "ベストのみ L", "ベストのみ 2L", "ベストのみ 3L", "ファンセットのみ"]
    };

    function addEvent(node) {
        const typeDropdown = node.querySelector('[field-id="種類"] select');
        const sizeInput = node.querySelector('[field-id="サイズ"] input'); // Lookup input
        const lookupButton = node.querySelector('.kb-icon.kb-icon-lookup.kb-search');

        if (!typeDropdown || !sizeInput || !lookupButton) return;

        typeDropdown.addEventListener('change', function () {
            const selectedType = this.value;

            if (!SIZE_MAP[selectedType]) return;

            // Fill lookup input with the first size (optional: can leave empty if you want user to select)
            sizeInput.value = ''; // Leave empty so user selects

            // Trigger click to open lookup table
            lookupButton.click();

            // After a short delay, filter the lookup table rows
            setTimeout(() => {
                const rows = document.querySelectorAll('.kb-lookup-table tbody tr');
                rows.forEach(row => {
                    const text = row.innerText || "";
                    if (SIZE_MAP[selectedType].some(size => text.includes(size))) {
                        row.style.display = ""; // show
                    } else {
                        row.style.display = "none"; // hide
                    }
                });
            }, 300); // Adjust if needed
        });
    }

    // Observe added nodes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(elem => {
                if (elem.nodeType === Node.ELEMENT_NODE && elem.querySelector('[field-id="種類"]')) {
                    addEvent(elem);
                }
            });
        });
    });

    observer.observe(parentNode, config);
});
