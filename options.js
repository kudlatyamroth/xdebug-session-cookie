const visiblityClass = 'is-visible';

async function saveOptions(e) {
    let messages = document.querySelector(".message").classList;
    messages.remove(visiblityClass);

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
    let messageClass = document.querySelector(".saved-successfully").classList;

    messageClass.add(visiblityClass);
    setTimeout(function() {
        messageClass.remove(visiblityClass);
    }, 2000);
}

function showError() {
    let messageClass = document.querySelector(".saved-error").classList;
    messageClass.add('is-visible');
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
