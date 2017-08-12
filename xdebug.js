let cookieName = 'XDEBUG_SESSION';
let currentTab;

function updateIcon() {
    getCookie().then((cookie) => {
        browser.browserAction.setIcon({
            path: cookie ? {
                "64": "icons/bug-red-64.png",
                "128": "icons/bug-red-128.png"
            } : {
                "64": "icons/bug-green-64.png",
                "128": "icons/bug-green-128.png"
            },
            tabId: currentTab.id
        });
        browser.browserAction.setTitle({
            title: cookie ? 'xDEBUG Session (on)' : 'xDEBUG Session (off)',
            tabId: currentTab.id
        });
    });
}

function toggleCookie() {
    getCookie().then((cookie) => {
        if (cookie) {
            browser.cookies.remove({
                url: currentTab.url,
                name: cookieName
            });
            updateIcon();
        } else {
            let gettingSessionKey = browser.storage.sync.get('xdebug_session');
            gettingSessionKey.then((res) => {
                browser.cookies.set({
                    url: currentTab.url,
                    name: cookieName,
                    value: res.xdebug_session || 'phpstorm',
                    path: "/"
                });
                updateIcon();
            });
        }
    });
}

function getCookie() {
    return browser.cookies.get({
        url: currentTab.url,
        name: cookieName
    });
}

function updateActiveTab() {
    function updateTab(tabs) {
        if (tabs[0]) {
            currentTab = tabs[0];
            updateIcon();
        }
    }

    let gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then(updateTab);
}

updateActiveTab();

browser.browserAction.onClicked.addListener(toggleCookie);
browser.tabs.onUpdated.addListener(updateActiveTab);
browser.tabs.onActivated.addListener(updateActiveTab);
browser.windows.onFocusChanged.addListener(updateActiveTab);

