let cookieName = 'XDEBUG_SESSION';
let currentTab;

async function updateIcon() {
    let cookie = await getCookie();
    let icons = await getIcons(cookie);

    browser.browserAction.setIcon({
        path: icons,
        tabId: currentTab.id
    });
    browser.browserAction.setTitle({
        title: cookie ? 'xDEBUG Session (on)' : 'xDEBUG Session (off)',
        tabId: currentTab.id
    });
}

async function toggleCookie() {
    let cookie = await getCookie();

    if (cookie) {
        browser.cookies.remove({
            url: currentTab.url,
            name: cookieName
        });
        updateIcon();
        return null;
    }

    let config = await browser.storage.sync.get('xdebug_session');

    browser.cookies.set({
        url: currentTab.url,
        name: cookieName,
        value: config.xdebug_session || 'phpstorm',
        path: "/"
    });
    updateIcon();
}

async function getIcons(cookie) {
    let state = 'xdebug_session_off_color';
    let stateColor = 'light';
    if (cookie) {
        state = 'xdebug_session_on_color';
        stateColor = 'red';
    }
    let config = await browser.storage.sync.get(state);
    if (config[state]) {
        stateColor = config[state];
    }

    return {
        "64": "icons/bug-"+ stateColor +"-64.png",
        "128": "icons/bug-"+ stateColor +"-128.png"
    }
}

async function getCookie() {
    return browser.cookies.get({
        url: currentTab.url,
        name: cookieName
    });
}

async function updateActiveTab() {
    function updateTab(tabs) {
        if (tabs[0]) {
            currentTab = tabs[0];
            updateIcon();
        }
    }

    let tabs = await browser.tabs.query({active: true, currentWindow: true});
    updateTab(tabs);
}

updateActiveTab();

browser.browserAction.onClicked.addListener(toggleCookie);
browser.tabs.onUpdated.addListener(updateActiveTab);
browser.tabs.onActivated.addListener(updateActiveTab);
browser.windows.onFocusChanged.addListener(updateActiveTab);

