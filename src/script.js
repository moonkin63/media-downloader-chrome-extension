chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var action = message.action;
    console.debug(message.action);
    if (action === 'download_mp3') {
        downloadMP3(message.url, message.title);
        return
    }
    if (action === 'set_badge_text') {
        setBadgeText(message.title);
        return
    }
});

function setBadgeText(badgeText) {
    chrome.browserAction.setBadgeText({text: badgeText + ''});
}

function downloadMP3(url, filename) {
    if (!endsWith(filename, '.mp3')) {
        filename += '.mp3';
    }
    chrome.downloads.download({
        url: url,
        filename: filename
    });
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

chrome.tabs.onActivated.addListener(function () {
    setBadgeText('');
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "start_timer"}, function (response) {
        });
    });
    chrome.tabs.query({active: false, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "stop_timer"}, function (response) {
        });
    });
});