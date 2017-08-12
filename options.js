const visiblityClass = 'is-visible';

async function saveOptions(e) {
    e.preventDefault();
    hideMessages();

    let saved = browser.storage.sync.set({
        xdebug_session: document.querySelector(".xdebug_session").value,
        xdebug_session_on_color: document.querySelector(".xdebug-session-on-color:checked").value,
        xdebug_session_off_color: document.querySelector(".xdebug-session-off-color:checked").value
    });
    saved.then(showSuccess, showError);
}

async function restoreOptions() {
    let sessionKey = await browser.storage.sync.get('xdebug_session');

    document.querySelector(".xdebug_session").value = sessionKey.xdebug_session || 'phpstorm';

    let onColor = sessionKey.xdebug_session_on_color || 'red';
    let offColor = sessionKey.xdebug_session_off_color || 'light';
    document.querySelector(".xdebug-session-on-color[value="+ onColor +"]").checked = true;
    document.querySelector(".xdebug-session-off-color[value="+ offColor +"]").checked = true;
}

function showSuccess() {
    let messageClass = document.querySelector(".saved-successfully").classList;

    messageClass.add(visiblityClass);
    setTimeout(function() {
        hideMessages();
    }, 2000);
}

function showError() {
    let messageClass = document.querySelector(".saved-error").classList;
    messageClass.add('is-visible');
}

function hideMessages() {
    let messages = document.querySelector(".message").classList;
    messages.remove(visiblityClass);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
