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
    let currentUrl = currentTab.url;

    if (cookie) {
        browser.cookies.remove({
            url: currentUrl.replace(/:{1}[0-9]{1}\d*/, ''),
            name: cookieName,
            storeId: currentTab.cookieStoreId
        });
        updateIcon();
        return null;
    }

    let valueToSet = await getValueToSet();
    browser.cookies.set({
        url: currentUrl.replace(/:{1}[0-9]{1}\d*/, ''),
        name: cookieName,
        value: valueToSet,
        path: "/",
        storeId: currentTab.cookieStoreId
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
        "64": "icons/bug-" + stateColor + "-64.png",
        "128": "icons/bug-" + stateColor + "-128.png"
    }
}

async function getValueToSet() {
    let config = await browser.storage.sync.get('xdebug_session');

    return config.xdebug_session || 'phpstorm';
}

async function getCookie() {
    let currentUrl = currentTab.url;
    let valueToSet = await getValueToSet();

    let cookie = await browser.cookies.get({
        url: currentUrl.replace(/:{1}[0-9]{1}\d*/, ''),
        name: cookieName,
        storeId: currentTab.cookieStoreId
    });

    if (cookie && cookie.value == valueToSet) {
        return cookie;
    }

    return null;
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

