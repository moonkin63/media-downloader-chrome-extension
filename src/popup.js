jQuery(document).ready(function () {
    window.addEventListener('DOMContentLoaded', function () {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {action: 'get_popup_content'},
                function (info) {
                    console.debug('asd');
                    $('#test_id').html(info.vk_video + '<ul class="list-group">' + info.vk_audio + '</ul>'
                    + info.youtube_video);

                    //vk audio
                    $('.download_btn').click(function () {
                        var mediaURL = $(this).attr('media_url');
                        var mediaTitle = $(this).attr('media_title');
                        chrome.extension.sendMessage({
                            action: 'download_mp3',
                            url: mediaURL,
                            title: mediaTitle
                        }, function (response) {
                        });
                    });

                    //vk video
                    $('button.md_vk_download_video_button').click(function () {
                        chrome.extension.sendMessage({
                            action: 'download_mp4', title: $(this).attr('media_title'),
                            url: $(this).attr('media_url')
                        }, function (response) {
                        });
                    });
                });
        });
    });
});