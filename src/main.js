function findMedia() {
    addDownloadButtonForAudio();
    addDownloadButtonForVideo();
    addDownloadButtonForYoutube();
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
            var downloadDiv = '<div id="md_vk_download_video">' +
                '<span class="md_vk_download_label">Download:</span><p></p>';
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

function addDownloadButtonForYoutube() {
    $('#player-mole-container').find('script').each(function () {
        if ($(this).attr('md_ready')) {
            return;
        }
        $(this).attr('md_ready', '1');
        if ($(this).text().indexOf('googlevideo.com') !== -1) {
            var config = $(this).text();
            var urls = extractVideoUrlsForYoutube(config);
            console.debug(urls);
            var videoTitle = $.trim($('#eow-title').text());
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
                chrome.extension.sendMessage({action: 'download_with_ext', title: $(this).attr('media_title'),
                    url: $(this).attr('media_url'), ext: $(this).attr('ext')}, function (response) {
                });
            });
        }
    });
}

function extractVideoUrlsForYoutube(info) {
    var urls = {};
//    info = 'var ytplayer = ytplayer || {};ytplayer.config = {"url": "https:\/\/s.ytimg.com\/yts\/swfbin\/player-vflNhng3G\/watch_as3.swf", "args": {"ssl": "1", "iurlhq": "https:\/\/i.ytimg.com\/vi\/aHJ74jFfCxM\/hqdefault.jpg", "iv3_module": "1", "logwatch": "1", "fexp": "3300104,3300134,3300137,3300161,3310366,3310699,3312478,903903,907259,927622,932404,938695,939978,943909,945232,946601,947209,947215,948124,949415,952302,952605,952901,953912,957103,957105,957201", "fmt_list": "22\/1280x720\/9\/0\/115,43\/640x360\/99\/0\/0,18\/640x360\/9\/0\/115,5\/426x240\/7\/0\/0,36\/426x240\/99\/1\/0,17\/256x144\/99\/1\/0", "watch_xlb": "https:\/\/s.ytimg.com\/yts\/xlbbin\/watch-strings-ru_RU-vflPCmD9V.xlb", "timestamp": "1415998806", "ldpj": "-7", "author": "vasya2895", "loaderUrl": "https:\/\/www.youtube.com\/watch?v=aHJ74jFfCxM", "video_id": "aHJ74jFfCxM", "t": "1", "ptk": "youtube_none", "pltype": "contentugc", "idpj": "-1", "no_get_video_log": "1", "csi_page_type": "watch,watch7_html5", "of": "CQmXyjYPL7kXPlQxeGp0Zg", "account_playback_token": "QUFFLUhqbVdJUEdRemdLRWVMR0lTQTZwSUZ1M21HTVBkZ3xBQ3Jtc0tuTmcyQVQwTGp2NGYtWm5Dc0w4RGktWFVya2wxOWZjLU4xSDlVUUFBbWFUOU5zSjhkc3gwZmUxMVVqSVpEUTJvcFFVMVFZaXlNY1dvUXZfNmo1ZmxqX0g3TklUT3JUeFpBNGlrbDl2VTYwai11T3lGNA==", "iurl": "https:\/\/i.ytimg.com\/vi\/aHJ74jFfCxM\/hqdefault.jpg", "watermark": ",https:\/\/s.ytimg.com\/yts\/img\/watermark\/youtube_watermark-vflHX6b6E.png,https:\/\/s.ytimg.com\/yts\/img\/watermark\/youtube_hd_watermark-vflAzLcD6.png", "thumbnail_url": "https:\/\/i.ytimg.com\/vi\/aHJ74jFfCxM\/default.jpg", "dash": "1", "cl": "79906668", "watch_ajax_token": "QUFFLUhqblJqR0tKNUEyQmJPZVY3Tlp4UTRFa3hHMUdSZ3xBQ3Jtc0ttWG00YUpMZnJtQkl1SnNLRHVYMnZvNFJwVUI3eTNwcFhrQTI5bHM4M2h4WmFyMzZSNFA2WGpzYmh0dXZVLXZzMUZKSlE4ZE9yZk1tNmdpWjlXeVRwVGdsOEo4ZmdSbUNETTR1cU5Wc1FDOGF2Y1RiVQ==", "plid": "AAUH1-nfG6uoTKXn", "cr": "RU", "cos": "Windows", "iv_invideo_url": "https:\/\/www.youtube.com\/annotations_invideo?cap_hist=1\u0026cta=2\u0026video_id=aHJ74jFfCxM", "atc": "a=3\u0026b=Hbfs1iB9FwIgAo3uf_yuOrvXNVM\u0026c=1415998806\u0026d=1\u0026e=aHJ74jFfCxM\u0026c3a=13\u0026c1a=1\u0026hh=DAkD5XzHMzJrWSyuOohFdpHlqvY", "avg_rating": "4.78947353363", "url_encoded_fmt_stream_map": "quality=hd720\u0026fallback_host=tc.v12.cache8.googlevideo.com\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fkey%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Did%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Cmime%252Cmm%252Cms%252Cmv%252Cratebypass%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26mime%3Dvideo%252Fmp4%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26upn%3DyM4aSRn9jBQ%26requiressl%3Dyes%26signature%3DF2E19068FF1D27A0ED91D336DC7FE58DDE664B62.6F3263E64E88156FFB10842BD9F17E2AC5FF6C74%26itag%3D22%26ratebypass%3Dyes%26mt%3D1415998653%26ipbits%3D0%26expire%3D1416020406\u0026itag=22\u0026type=video%2Fmp4%3B+codecs%3D%22avc1.64001F%2C+mp4a.40.2%22,quality=medium\u0026fallback_host=tc.v3.cache3.googlevideo.com\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fkey%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Did%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Cmime%252Cmm%252Cms%252Cmv%252Cratebypass%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26mime%3Dvideo%252Fwebm%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26upn%3DyM4aSRn9jBQ%26requiressl%3Dyes%26signature%3D677DDA0444D795FBC45F0627EB4E0E7092B3D997.AE94AB40148FB69759385961591CC508950F229F%26itag%3D43%26ratebypass%3Dyes%26mt%3D1415998653%26ipbits%3D0%26expire%3D1416020406\u0026itag=43\u0026type=video%2Fwebm%3B+codecs%3D%22vp8.0%2C+vorbis%22,quality=medium\u0026fallback_host=tc.v2.cache1.googlevideo.com\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fkey%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Did%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Cmime%252Cmm%252Cms%252Cmv%252Cratebypass%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26mime%3Dvideo%252Fmp4%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26upn%3DyM4aSRn9jBQ%26requiressl%3Dyes%26signature%3D32C9F4B4EAD3CD82EC58CD5549D7F325B75F7097.1136EA5F6CBBD442FA5317ED9D4B3941525B3A50%26itag%3D18%26ratebypass%3Dyes%26mt%3D1415998653%26ipbits%3D0%26expire%3D1416020406\u0026itag=18\u0026type=video%2Fmp4%3B+codecs%3D%22avc1.42001E%2C+mp4a.40.2%22,quality=small\u0026fallback_host=tc.v5.cache6.googlevideo.com\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fkey%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Did%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26mime%3Dvideo%252Fx-flv%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26upn%3DyM4aSRn9jBQ%26requiressl%3Dyes%26signature%3D01551A84CA1C1CBE2CF05546CDEAD0697207F6B4.44E6206A23E390B63B8A542D4C43A802ECD4BAD1%26itag%3D5%26mt%3D1415998653%26ipbits%3D0%26expire%3D1416020406\u0026itag=5\u0026type=video%2Fx-flv,quality=small\u0026fallback_host=tc.v20.cache8.googlevideo.com\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fkey%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Did%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26mime%3Dvideo%252F3gpp%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26upn%3DyM4aSRn9jBQ%26requiressl%3Dyes%26signature%3D9095DA3C42B74C09299D0325121F6A6221C9FD22.D1588E4B367364C28E81C281CFCB2E8978ECE425%26itag%3D36%26mt%3D1415998653%26ipbits%3D0%26expire%3D1416020406\u0026itag=36\u0026type=video%2F3gpp%3B+codecs%3D%22mp4v.20.3%2C+mp4a.40.2%22,quality=small\u0026fallback_host=tc.v15.cache5.googlevideo.com\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fkey%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Did%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26mime%3Dvideo%252F3gpp%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26upn%3DyM4aSRn9jBQ%26requiressl%3Dyes%26signature%3DB3AA8268BD613E00CE5BCD1870886124E0330E16.5D5FD7E329977CEAAF0B41E9FF23CB8E3C215A6D%26itag%3D17%26mt%3D1415998653%26ipbits%3D0%26expire%3D1416020406\u0026itag=17\u0026type=video%2F3gpp%3B+codecs%3D%22mp4v.20.3%2C+mp4a.40.2%22", "token": "1", "view_count": "5510", "host_language": "ru", "sourceid": "y", "hl": "ru_RU", "cbrver": "38.0.2125.111", "sdetail": "p:\/embed\/aHJ74jFfCxM", "iurlsd": "https:\/\/i.ytimg.com\/vi\/aHJ74jFfCxM\/sddefault.jpg", "allow_embed": "1", "c": "WEB", "user_gender": "m", "title": "\u041d\u0430 \u0433\u043e\u0440\u043e\u0434 \u043e\u043f\u0443\u0441\u043a\u0430\u0435\u0442\u0441\u044f \u043d\u043e\u0447\u044c (Full Hd Time Lapse)", "authuser": 0, "cbr": "Chrome", "adaptive_fmts": "init=0-711\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fgir%3Dyes%26key%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Dclen%252Cdur%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26clen%3D10432079%26dur%3D31.160%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26lmt%3D1377230907528990%26requiressl%3Dyes%26signature%3D5C846774978D5C7BA0900295AF3DB3E9E4DD5D8F.D8F9CDEDD5231CC5A78DE157C2FA8899FF16DD63%26itag%3D137%26keepalive%3Dyes%26upn%3DyM4aSRn9jBQ%26mt%3D1415998653%26mime%3Dvideo%252Fmp4%26ipbits%3D0%26expire%3D1416020406\u0026size=1920x1080\u0026type=video%2Fmp4%3B+codecs%3D%22avc1.640028%22\u0026lmt=1377230907528990\u0026index=712-815\u0026clen=10432079\u0026bitrate=3964377\u0026itag=137\u0026fps=25,init=0-709\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fgir%3Dyes%26key%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Dclen%252Cdur%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26clen%3D5405986%26dur%3D31.160%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26lmt%3D1377230907527592%26requiressl%3Dyes%26signature%3DE1D81056485EAAD70F2AA108C3CF35DBDDCED63F.2B9EFC0DE1512A308D41F1BE548D125C0039500C%26itag%3D136%26keepalive%3Dyes%26upn%3DyM4aSRn9jBQ%26mt%3D1415998653%26mime%3Dvideo%252Fmp4%26ipbits%3D0%26expire%3D1416020406\u0026size=1280x720\u0026type=video%2Fmp4%3B+codecs%3D%22avc1.4d401f%22\u0026lmt=1377230907527592\u0026index=710-813\u0026clen=5405986\u0026bitrate=1698805\u0026itag=136\u0026fps=25,init=0-708\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fgir%3Dyes%26key%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Dclen%252Cdur%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26clen%3D2634460%26dur%3D31.160%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26lmt%3D1377230908530403%26requiressl%3Dyes%26signature%3D55F06D57782E8BDED170A1D0513E0E9131E57A82.4C72AD13FB2F60BEF8DDA7F54D88C2D6809F9295%26itag%3D135%26keepalive%3Dyes%26upn%3DyM4aSRn9jBQ%26mt%3D1415998653%26mime%3Dvideo%252Fmp4%26ipbits%3D0%26expire%3D1416020406\u0026size=854x480\u0026type=video%2Fmp4%3B+codecs%3D%22avc1.4d401e%22\u0026lmt=1377230908530403\u0026index=709-812\u0026clen=2634460\u0026bitrate=783970\u0026itag=135\u0026fps=25,init=0-708\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fgir%3Dyes%26key%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Dclen%252Cdur%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26clen%3D1227726%26dur%3D31.160%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26lmt%3D1377230907437705%26requiressl%3Dyes%26signature%3D16366D0F834B90491C1FFE76CBCC091F087F8D91.183C90B435798E44E84DBAA8DA28179DC1A9FFBE%26itag%3D134%26keepalive%3Dyes%26upn%3DyM4aSRn9jBQ%26mt%3D1415998653%26mime%3Dvideo%252Fmp4%26ipbits%3D0%26expire%3D1416020406\u0026size=640x360\u0026type=video%2Fmp4%3B+codecs%3D%22avc1.4d401e%22\u0026lmt=1377230907437705\u0026index=709-812\u0026clen=1227726\u0026bitrate=368614\u0026itag=134\u0026fps=25,init=0-673\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fgir%3Dyes%26key%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Dclen%252Cdur%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26clen%3D969158%26dur%3D31.160%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26lmt%3D1377230906397812%26requiressl%3Dyes%26signature%3D9FBE8F0C1C242A44113FDA1CAB60BBFE246E895D.5899C4865A6838D466C8978AE0D63082DB8B0ABA%26itag%3D133%26keepalive%3Dyes%26upn%3DyM4aSRn9jBQ%26mt%3D1415998653%26mime%3Dvideo%252Fmp4%26ipbits%3D0%26expire%3D1416020406\u0026size=426x240\u0026type=video%2Fmp4%3B+codecs%3D%22avc1.4d4015%22\u0026lmt=1377230906397812\u0026index=674-777\u0026clen=969158\u0026bitrate=252327\u0026itag=133\u0026fps=25,init=0-670\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fgir%3Dyes%26key%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Dclen%252Cdur%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26clen%3D434577%26dur%3D31.160%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26lmt%3D1377230903186116%26requiressl%3Dyes%26signature%3D0887B9C11AB4D9D5570D307A079744CC27545887.CCA21A9926C27F8111D8CE4B49B41C0136D21C72%26itag%3D160%26keepalive%3Dyes%26upn%3DyM4aSRn9jBQ%26mt%3D1415998653%26mime%3Dvideo%252Fmp4%26ipbits%3D0%26expire%3D1416020406\u0026size=256x144\u0026type=video%2Fmp4%3B+codecs%3D%22avc1.42c00c%22\u0026lmt=1377230903186116\u0026index=671-774\u0026clen=434577\u0026bitrate=113478\u0026itag=160\u0026fps=15,init=0-591\u0026url=https%3A%2F%2Fr2---sn-xguxaxjvh-304e.googlevideo.com%2Fvideoplayback%3Fgir%3Dyes%26key%3Dyt5%26mm%3D31%26ip%3D46.0.76.9%26fexp%3D3300104%252C3300104%252C3300134%252C3300134%252C3300137%252C3300137%252C3300161%252C3300161%252C3310366%252C3310366%252C3310699%252C3310699%252C3312478%252C3312478%252C903903%252C907259%252C927622%252C932404%252C938695%252C939978%252C943909%252C945232%252C946601%252C947209%252C947215%252C948124%252C949415%252C952302%252C952605%252C952901%252C953912%252C957103%252C957105%252C957201%26initcwndbps%3D3610000%26mv%3Dm%26sparams%3Dclen%252Cdur%252Cgir%252Cid%252Cinitcwndbps%252Cip%252Cipbits%252Citag%252Ckeepalive%252Clmt%252Cmime%252Cmm%252Cms%252Cmv%252Crequiressl%252Csource%252Cupn%252Cexpire%26source%3Dyoutube%26ms%3Dau%26sver%3D3%26clen%3D497457%26dur%3D31.254%26id%3Do-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po%26lmt%3D1377230885496510%26requiressl%3Dyes%26signature%3D03F8009A28F471E512539ED90D117649A78155D9.AC7A97BED704AFD8D5B49F14E1AC507155D592CB%26itag%3D140%26keepalive%3Dyes%26upn%3DyM4aSRn9jBQ%26mt%3D1415998653%26mime%3Daudio%252Fmp4%26ipbits%3D0%26expire%3D1416020406\u0026type=audio%2Fmp4%3B+codecs%3D%22mp4a.40.2%22\u0026lmt=1377230885496510\u0026index=592-671\u0026clen=497457\u0026bitrate=127863\u0026itag=140", "tmi": "1", "enablecsi": "1", "iurlmq": "https:\/\/i.ytimg.com\/vi\/aHJ74jFfCxM\/mqdefault.jpg", "referrer": "https:\/\/www.youtube.com\/embed\/aHJ74jFfCxM?autoplay=1\u0026autohide=1\u0026wmode=opaque\u0026showinfo=0\u0026fs=1", "cosver": "6.3", "keywords": "time lapse,full,Hd,Samara,\u0421\u0430\u043c\u0430\u0440\u0430,\u043d\u043e\u0447\u044c,\u0443\u0441\u043a\u043e\u0440\u0435\u043d\u043e,\u0437\u0430\u043c\u0435\u0434\u043b\u0435\u043d\u043e", "vq": "auto", "user_age": "23", "allow_ratings": "1", "iv_module": "https:\/\/s.ytimg.com\/yts\/swfbin\/player-vflNhng3G\/iv_module.swf", "length_seconds": "32", "eventid": "Vm1mVNS3H8aawwOm5oCAAQ", "probe_url": "https:\/\/r2---sn-jc47eu76.c.youtube.com\/videogoodput?id=o-AGkR5d6TjbPYqKFrr7utFBg7GumYTLVfXLXHUydXEzQk\u0026source=goodput\u0026range=0-99999\u0026expire=1416002406\u0026ip=46.0.76.9\u0026ms=pm\u0026nh=CAE\u0026sparams=id,source,range,expire,ip,ms,nh\u0026signature=172283E22306ED522E89996FA55D1DE6D0204884.74371D88E66EF6D0E8953E4FC70EF4097A180536\u0026key=cms1", "dashmpd": "https:\/\/manifest.googlevideo.com\/api\/manifest\/dash\/playback_host\/r2---sn-xguxaxjvh-304e.googlevideo.com\/signature\/0C8445F1350AA04D72DD45C741E8C46D348A2FBA.8EBFB30DA1AE1267DEA68CC617277CC9BBF6E225\/upn\/yM4aSRn9jBQ\/mt\/1415998653\/key\/yt5\/requiressl\/yes\/mm\/31\/ip\/46.0.76.9\/itag\/0\/fexp\/3300104%2C3300104%2C3300134%2C3300134%2C3300137%2C3300137%2C3300161%2C3300161%2C3310366%2C3310366%2C3310699%2C3310699%2C3312478%2C3312478%2C903903%2C907259%2C927622%2C932404%2C938695%2C939978%2C943909%2C945232%2C946601%2C947209%2C947215%2C948124%2C949415%2C952302%2C952605%2C952901%2C953912%2C957103%2C957105%2C957201\/as\/fmp4_audio_clear%2Cwebm_audio_clear%2Cfmp4_sd_hd_clear%2Cwebm_sd_hd_clear%2Cwebm2_sd_hd_clear\/mv\/m\/sparams\/as%2Cid%2Cip%2Cipbits%2Citag%2Cmm%2Cms%2Cmv%2Cplayback_host%2Crequiressl%2Csource%2Cexpire\/source\/youtube\/ms\/au\/ipbits\/0\/sver\/3\/expire\/1416020406\/id\/o-ALunhWhFKiPntnQwIr_o3bR8tzEdiKxzrrqUSk-kV1Po", "iv_load_policy": "1", "enablejsapi": 1, "ucid": "UCWt9eEAlBtY5TFIVjceiRxA"}, "attrs": {"id": "movie_player"}, "params": {"allowscriptaccess": "always", "allowfullscreen": "true", "bgcolor": "#000000"}, "url_v8": "https:\/\/s.ytimg.com\/yts\/swfbin\/player-vflNhng3G\/cps.swf", "url_v9as2": "https:\/\/s.ytimg.com\/yts\/swfbin\/player-vflNhng3G\/cps.swf", "messages": {"player_fallback": ["\u0414\u043b\u044f \u0432\u043e\u0441\u043f\u0440\u043e\u0438\u0437\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u0432\u0438\u0434\u0435\u043e \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c \u043f\u0440\u043e\u0438\u0433\u0440\u044b\u0432\u0430\u0442\u0435\u043b\u044c Adobe Flash Player \u0438\u043b\u0438 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u0441 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u043e\u0439 HTML5. \u003ca href=\"http:\/\/get.adobe.com\/flashplayer\/\"\u003e\u0421\u043a\u0430\u0447\u0430\u0442\u044c \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u044e\u044e \u0432\u0435\u0440\u0441\u0438\u044e Flash Player \u003c\/a\u003e \u003ca href=\"\/html5\"\u003e\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435 \u043e\u0431 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0438 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0434\u043e \u0432\u0435\u0440\u0441\u0438\u0438 \u0441 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u043e\u0439 HTML5\u003c\/a\u003e"]}, "html5": true, "sts": 16387, "min_version": "8.0.0", "assets": {"html": "\/html5_player_template", "css": "\/\/s.ytimg.com\/yts\/cssbin\/www-player-webp-vflQEpw9K.css", "js": "\/\/s.ytimg.com\/yts\/jsbin\/html5player-ru_RU-vfl_cu8Bv\/html5player.js"}};ytplayer.load = function() {yt.player.Application.create("player-api", ytplayer.config);ytplayer.config.loaded = true;};(function() {if (!!window.yt && yt.player && yt.player.Application) {ytplayer.load();}}()); ';
    var key = '\\u0026url';
    var itagKey = 'itag=';
    while (info.indexOf(key) !== -1) {
        info = info.substring(info.indexOf(key) + key.length + 1, info.length);
        var currentUrl = info.substring(0, info.indexOf('\u0026'));
        if (currentUrl.indexOf('itag') !== -1) {
            currentUrl = decodeURIComponent(decodeURIComponent(currentUrl));
            var itag = currentUrl.substring(currentUrl.indexOf(itagKey) + itagKey.length, currentUrl.length);
            itag = itag.substring(0, itag.indexOf('&'));
            urls[itag] = currentUrl;
        }
    }
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