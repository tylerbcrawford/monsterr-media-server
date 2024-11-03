document.getElementById('config-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);

    // Prepare data to send to the server
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Send data to the server (you would need to implement the server-side handling)
    fetch('/save-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            alert('Configuration saved successfully.');
        } else {
            alert('Failed to save configuration.');
        }
    });
});
