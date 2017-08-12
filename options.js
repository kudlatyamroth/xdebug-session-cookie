function saveOptions(e) {
    browser.storage.sync.set({
        xdebug_session: document.querySelector("#xdebug_session").value
    });
    e.preventDefault();
}

function restoreOptions() {
    let gettingItem = browser.storage.sync.get('xdebug_session');
    gettingItem.then((res) => {
        document.querySelector("#xdebug_session").value = res.xdebug_session || 'phpstorm';
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
