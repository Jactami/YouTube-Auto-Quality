let checkbox = document.querySelector('input[type=checkbox]');
let radios = document.querySelectorAll('input[type=radio]');

// set inital values 
chrome.storage.local.get(null, settings => {
    checkbox.checked = settings.enabled || false;

    for (let radio of radios) {
        if (radio.value === settings.target) {
            radio.checked = true;
            break;
        }
    }
});

// add listeners for input changes
checkbox.addEventListener('input', inputHandler);
radios.forEach(radio => radio.addEventListener('input', inputHandler));

function inputHandler() {
    let settings = {
        enabled: checkbox.checked,
        target: document.querySelector('input[type=radio]:checked').value
    }

    chrome.storage.local.set(settings);
}