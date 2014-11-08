function addDownloadButton() {
    console.debug('timer.tick');
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
                parent.html(parent.html() + '<div onclick="cur.cancelClick = true;" ' +
                    'style=" position: absolute; left: 101%; margin-top: 9px; z-index: 100" class="download_btn"' +//todo css
                    'media_url="' + url + '"; media_title="' + info.text() + '">_D_</div>');
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

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function startTimer() {
    if (!timer) {
        timer = setInterval(addDownloadButton, 1000);
    }
//    isTimerStarted = true;
//    var timer = setTimeout(function run() {
//        console.debug('timer.tick');
//        if (isTimerStarted) {
//            addDownloadButton();
//            timer = setTimeout(run, 2000);
//        }
//    }, 2000);
}

jQuery(document).ready(function () {
    startTimer();
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