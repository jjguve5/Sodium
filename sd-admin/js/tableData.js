document.getElementById('editabletable').addEventListener('dblclick', function(e) {
    var target = e.target;
    
    // Ensure the double-clicked element is a 'td'
    if (target.tagName === 'TD') {
        // Save current text
        var originalText = target.textContent;

        // Create an input element
        var input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        target.innerHTML = '';
        input.classList.add("modal-input")
        target.appendChild(input);

        // Focus on the new input element
        input.focus();

        // Event to handle when user stops editing
        input.addEventListener('blur', function() {
            target.textContent = input.value;
        });

        // Optional: Save on Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                input.blur(); // This will trigger the 'blur' event
            }
        });
    }
});