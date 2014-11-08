function addDownloadButton() {
    var countMedia = 0;
    $('input').each(function () {
        var str = $(this).attr('value');
        str += '';
        if (str.indexOf('.mp3') != -1) {
            var url = str.split('.mp3')[0] + '.mp3';
            countMedia++;
            if (!$(this).attr('dm_btn')) {
                $(this).attr('dm_btn', '1');
                var parent = $(this).closest('div[class^="area clear_fix"]');
                var info = parent.find('.title_wrap');
                parent.html(parent.html() + '<div class="download_btn" onclick="cur.cancelClick = true;" ' +
                    'style="background-image:url(\'' + downloadButtonURL + '\')"' +
                    'media_url="' + url + '"; media_title="' + info.text() + '"></div>');
            }
        }
    });

    chrome.extension.sendMessage({action: 'set_badge_text', title: countMedia}, function (response) {
    });
    $('.download_btn').unbind('click');
    $('.download_btn').click(function () {
        var mediaURL = $(this).attr('media_url');
        var mediaTitle = $(this).attr('media_title');
        chrome.extension.sendMessage({action: 'download_mp3', url: mediaURL, title: mediaTitle}, function (response) {
        });
    });

}

function downloadMP3(url, filename) {
    chrome.downloads.download({
        url: url,
        filename: filename
    });
}

var timer;
var downloadButtonURL = chrome.extension.getURL("img/download.ico");

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function startTimer() {
    if (!timer) {
        timer = setInterval(addDownloadButton, 1000);
        console.debug('timer = ' + timer);
    }
}

jQuery(document).ready(function () {
//    startTimer();
    chrome.extension.sendMessage({action: 'register_page'}, function (response) {
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var action = message.action;
    console.debug(message.action);
    if (action === 'stop_timer') {
        stopTimer();
        return;
    }
    if (action === 'start_timer') {
        startTimer()
        return;
    }
});