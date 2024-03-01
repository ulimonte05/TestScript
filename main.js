window.onload = function() {
    var apiKey = scriptConfig.apiKey;
    scriptConfig.buttons.forEach(function(buttonConfig) {
        var button = document.getElementById(buttonConfig.id);
        if (button) {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                redirectToWhatsApp(buttonConfig.id, buttonConfig.name, apiKey);
            });
        } else {
            console.error('Button not found for ID:', buttonConfig.id);
        }
    });
};
function redirectToWhatsApp(buttonId, buttonName, apiKey) {
    console.log('Button clicked:', buttonId, buttonName);
    var currentUrl = window.location.href;
    var apiUrl = 'https://source-tracker.letschatty.com/generate_whatsapp_url';
    var newTab = window.open('', '_blank');

    console.log('Sending API request with body:', { referer_url: currentUrl, button_id: buttonId, button_name: buttonName });
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
        },
        body: JSON.stringify({
            referer_url: currentUrl,
            button_id: buttonId,
            button_name: buttonName
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.whatsapp_url) {
            newTab.location.href = data.whatsapp_url;
        } else {
            throw new Error('No WhatsApp URL returned from the server.');
        }
    })
    .catch(error => {
        console.error('Error fetching WhatsApp URL:', error);
        newTab.location.href = `https://wa.me/?text=${encodeURIComponent('Hola! Me contacto desde la página web ' + currentUrl + ' para recibir información, por favor!')}`;
    });
}