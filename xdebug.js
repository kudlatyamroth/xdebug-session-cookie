var cookieName = 'XDEBUG_SESSION';
var currentTab;

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
            var d = new Date();
            d.setTime(d.getTime() + (2*24*60*60*1000));
            
            var gettingSessionKey = browser.storage.sync.get('xdebug_session');
            gettingSessionKey.then((res) => {
                browser.cookies.set({
                    url: currentTab.url,
                    name: cookieName,
                    value: res.xdebug_session || 'phpstorm',
                    path: "/",
                    expirationDate: d.getTime()/1000
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

browser.browserAction.onClicked.addListener(toggleCookie);

function updateActiveTab(tabs) {
    function updateTab(tabs) {
        if (tabs[0]) {
            currentTab = tabs[0];
            updateIcon();
        }
    }
    
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then(updateTab);
}

browser.tabs.onUpdated.addListener(updateActiveTab);
browser.tabs.onActivated.addListener(updateActiveTab);
browser.windows.onFocusChanged.addListener(updateActiveTab);

updateActiveTab();
