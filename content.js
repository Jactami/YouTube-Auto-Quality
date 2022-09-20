// default settings
let settings = {
    enabled: true,
    target: 'Auto'
};

// wait for yt settings to load
document.addEventListener('yt-navigate-finish', run);

// listen for user input
chrome.storage.onChanged.addListener(run);

function run() {
    // do not execute on main page, profiles, etc.
    if (location.pathname !== '/watch') return;

    // retrieve preferred settings and update quality
    initSettings(() => {
        if (settings.enabled) {
            setQuality(settings.target);
        }
    });
}

// retrieve settings from storage
// https://stackoverflow.com/questions/28006730/chrome-extension-settings/28007884#28007884
function initSettings(callback) {
    chrome.storage.local.get(null, stored => {
        // merge default settings with stored settings
        settings = {
            ...settings,
            ...stored
        };
        chrome.storage.local.set(settings);

        callback && callback();
    });
}

function setQuality(target) {
    // open quality menu
    let settingsBtns = document.querySelectorAll('.ytp-button.ytp-settings-button');
    for (let settingsBtn of settingsBtns) {
        settingsBtn.click();
    }

    // document.querySelector('.ytp-panel-menu .ytp-menuitem:last-child').click();
    let menus = document.querySelectorAll('.ytp-panel-menu');
    let selectedQuality;
    for (let menu of menus) {
        let qualityBtn = menu.querySelector(".ytp-menuitem:last-child");
        if (!qualityBtn) continue;

        qualityBtn.click();

        // set quality to predefined target value
        let qualityOptions = document.querySelectorAll('.ytp-quality-menu .ytp-menuitem-label');
        if (qualityOptions.length === 0) continue;

        let optionFound = false;
        for (let option of qualityOptions) {
            if (option.textContent.includes(target)) {
                option.click();
                selectedQuality = option.textContent;
                optionFound = true;
                break;
            }
        }

        // use highest available quality if target quality is not available
        if (!optionFound) {
            qualityOptions[0].click();
            selectedQuality = qualityOptions[0].textContent;
        }
    }

    // remove focus from button
    for (let settingsBtn of settingsBtns) {
        settingsBtn.blur();
    }

    console.log(`YouTube Auto Quality: Quality set to ${selectedQuality}`);
}