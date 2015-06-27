var md_vk_audio = '';
var md_vk_video = '';
var md_youtube_video = '';

function findMedia() {
    if ('vk.com' === document.domain) {
        addDownloadButtonForAudio();
        addDownloadButtonForVideo();
    }
    if ('www.youtube.com' === document.domain) {
        addDownloadButtonForYoutube();
    }
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
                md_vk_audio += '<li class="download_btn list-group-item list-group-item-info" onclick="cur.cancelClick = true;" ' +
                'media_url="' + url + '"; media_title="' + fileName + '">' + fileName + '</li>';
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
            var downloadDiv = '<div id="md_vk_download_video">' +
                '<span class="md_vk_download_label">Download:</span><p></p>';
            for (var key in urls) {
                downloadDiv += '<div class="md_vk_download_video_button" media_title="' + videoTitle + '_' + key +
                '" media_url="' + urls[key] + '">' + key + '</div>';
                md_vk_video+='<button class="md_vk_download_video_button" media_title="' + videoTitle + '_' + key +
                '" media_url="' + urls[key] + '">' + key + '</button>';
            }
            downloadDiv += '</div>'
            $('.mv_share_actions').append(downloadDiv);
            $('div.md_vk_download_video_button').click(function () {
                chrome.extension.sendMessage({
                    action: 'download_mp4', title: $(this).attr('media_title'),
                    url: $(this).attr('media_url')
                }, function (response) {
                });
            });
        }
    }
}

function addDownloadButtonForYoutube() {
    var videoTitle = $.trim($('#eow-title').text());
    if (!videoTitle) {
        return;
    }
    $('#player-mole-container').find('script').each(function () {
        if ($(this).attr('md_ready') === videoTitle) {
            return;
        }
        $(this).attr('md_ready', videoTitle);
        if ($(this).text().indexOf('googlevideo.com') !== -1) {
            var config = $(this).text();
            var urls = extractVideoUrlsForYoutube(config);
            console.debug(urls);

            var downloadDiv = '<div id="md_y_download_video"><span class="md_y_download_label">Download:</span>';
            for (var key in urls) {
                if (!itagExt[key]) {
                    continue;
                }
                downloadDiv += '<div class="md_y_download_video_button" media_title="' + videoTitle + '_' + key +
                '" media_url="' + urls[key] + '" ext="' + itagExt[key] + '" itag="' + key + '">' + itagExt[key] +
                ' ' + itagName[key] + '</div>';
            }
            downloadDiv += '</div>';
            $('#eow-title').parent().parent().append(downloadDiv);
            $('div.md_y_download_video_button').click(function () {
                chrome.extension.sendMessage({
                    action: 'download_with_ext', title: $(this).attr('media_title'),
                    url: $(this).attr('media_url'), ext: $(this).attr('ext')
                }, function (response) {
                });
            });
        }
    });
}

function extractVideoUrlsForYoutube(info) {
    var urls = {};
    var key = 'u0026url';
    var itagKey = 'itag=';
    while (info.indexOf(key) !== -1) {
        info = info.substring(info.indexOf(key) + key.length + 1, info.length);
        var currentUrl = info.substring(0, info.indexOf('u0026') - 1);
        if (currentUrl.indexOf('itag') !== -1) {
            currentUrl = decodeURIComponent(decodeURIComponent(currentUrl));
            currentUrl = currentUrl.split("&amp;").join("&");
            var itag = currentUrl.substring(currentUrl.indexOf(itagKey) + itagKey.length, currentUrl.length);
            itag = itag.substring(0, itag.indexOf('&'));
            urls[itag] = currentUrl;
        }
    }
    urls;
    return urls;
}

function extractVideoUrlsForVK(info) {
    var urls = {};
    var text = info;
    if (!text) {
        return urls;
    }
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
        timer = setInterval(findMedia, 2000);
    }
}

jQuery(document).ready(function () {
    chrome.extension.sendMessage({action: 'register_page'}, function (response) {
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var action = message.action;
    console.debug(message.action + ' | ' + document.domain);
    if (action === 'stop_timer') {
        stopTimer();
        return;
    }
    if (action === 'start_timer') {
        startTimer()
        return;
    }
    if (action === 'get_popup_content') {
        sendResponse({
            vk_video: md_vk_video,
            vk_audio: md_vk_audio,
            youtube_video: md_youtube_video,
            domain: document.domain
        });
    }
});