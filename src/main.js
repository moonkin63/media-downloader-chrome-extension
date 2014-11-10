function findMedia() {
    addDownloadButtonForAudio();
    addDownloadButtonForVideo();
}

function addDownloadButtonForAudio() {
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
                var fileName = $.trim(info.text())
                parent.html(parent.html() + '<div class="download_btn" onclick="cur.cancelClick = true;" ' +
                    'style="background-image:url(\'' + downloadButtonURL + '\')"' +
                    'media_url="' + url + '"; media_title="' + fileName + '"></div>');
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

function addDownloadButtonForVideo() {
    var player = $('#video_player');
    if (player) {
        if (!player.attr('md_ready')) {
            player.attr('md_ready', '1');
            var videoTitle = $.trim($('#mv_min_title').text());
            var playerInfo = player.attr('flashvars');
            var urls = extractVideoUrlsForVK(playerInfo);
            var downloadDiv = '<div id="md_vk_download_video"><span class="md_vk_download_video_button">Download:</span>';
            for (var key in urls) {
                downloadDiv += '<div class="md_vk_download_video_button" media_title="' + videoTitle + '_' + key +
                    '" media_url="' + urls[key] + '">' + key + '</div>';
            }
            downloadDiv += '</div>'
            $('#mv_content').append(downloadDiv);
            $('div.md_vk_download_video_button').click(function () {
                chrome.extension.sendMessage({action: 'download_mp4', title: $(this).attr('media_title'),
                    url: $(this).attr('media_url')}, function (response) {
                });
            });
        }
    }
}

function extractVideoUrlsForVK(info) {
    var urls = {};
    var text = info;
    while (text.indexOf('url') !== -1) {
        text = text.substring(text.indexOf('url'), text.length);
        var extractedURL = decodeURIComponent(text.substring(text.indexOf('=') + 1, text.indexOf('&')));
        var size = text.substring(text.indexOf('url') + 3, text.indexOf('='));
        text = text.substring(text.indexOf('&'), text.length);
        if (extractedURL.indexOf('http') !== -1) {
            urls[size] = extractedURL;
        }
    }
    return urls;
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
        timer = setInterval(findMedia, 1000);
    }
}

jQuery(document).ready(function () {
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