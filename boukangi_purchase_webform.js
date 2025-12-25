window.addEventListener('load', function () {
    //Get the parent element to be monitored
    const parentNode = document.body; // Monitor the parent element

    // Set options
    const config = { childList: true, subtree: true };

    function addevent(node) {
        var dropdown = node.querySelector('select');
        dropdown.addEventListener('change', () => {
            var selectedValue = node.querySelector('tbody > tr > td > div > div > span').textContent;
            selectedValue = selectedValue.split('(')[0].trim(); // Get and trim before '('
            if (selectedValue === "Dual-purpose hat") {
                selectedValue = "hat";
            }
            var targetElement = node.querySelector('[field-id="size"] > div > input');
            targetElement.value = selectedValue;

            if (selectedValue){
                // Create and fire a change event
                var changeEvent = new Event('click');
                var searchbutton = node.querySelector('.kb-icon.kb-icon-lookup.kb-search')
                searchbutton.dispatchEvent(changeEvent);
            }
        });
    }

    // Create an observer instance
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(elem => {
                if (elem.nodeType === Node.ELEMENT_NODE && elem.querySelector('[field-id="Workwear"]')) {
                    var node = elem.querySelector('tr');
                    addevent(node);
                    startObservingTargetElement();
                }
            });
        });
    });

    // Start monitoring
    observer.observe(parentNode, config);

    function startObservingTargetElement() {
        // Set MutationObserver
        const Observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.innerText.includes("種類")){
                        addevent(node);
                    }
                });
            });
        });
        // Start the Observer
        Observer.observe(parentNode, config);
    }
});
