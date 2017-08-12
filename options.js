async function saveOptions(e) {
    let saved = browser.storage.sync.set({
        xdebug_session: document.querySelector("#xdebug_session").value
    });
    saved.then(showSuccess, showError);
    e.preventDefault();
}

async function restoreOptions() {
    let sessionKey = await browser.storage.sync.get('xdebug_session');

    document.querySelector("#xdebug_session").value = sessionKey.xdebug_session || 'phpstorm';
}

function showSuccess() {
    console.log('saved succesfully');
}

function showError() {
    console.log('there were some errors');
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
