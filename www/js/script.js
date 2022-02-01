/* LOAD SCRIPT PLAYER */
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('tracklist-video', {
        events: {
            'onReady': onPlayerReady
        }
    });
}


/* LOAD READY  LIBRARY YOUTUBE API */

function onPlayerReady() {
    $("#tracklist-options-x").html('<div id="video-options"><button class="button button-outlined button-small block-mobile" id="tracklist-video-playlist"><i class="fa fa-mouse-pointer"></i>  TEMA</button>' + '<button class="button button-outlined button-small block-mobile" id="tracklist-video-load"><i class="fa fa-list-ul"></i> Tracklist</button><button class="button button-outlined button-small block-mobile" id="tracklist-video-float"><i class="fa fa-window-restore"></i> Flotar</button>' + '<button class="button button-outlined button-small block-mobile" id="tracklist-video-repeat"><i class="fa fa-undo"></i> Repetir</button></div>');
    var VIDEO_TRACKLIST_ID = $("#tracklist-video").attr("data-id-video");
    console.log(VIDEO_TRACKLIST_ID)
    var API_KEY_YOUTUBE = 'AIzaSyBv3l97UnzWC65YLSNtRJFhMJdGqlUG45g';

    var time_update_interval = 0;
    var timeConvertion = 0;
    var repeat = false;

    var float_player_drag = $(".draggable");
    var float_player_drag_open = $(".draggable-open");
    var float_player = $("#float-player-youtube");
    var times_items = $(".tracklist-set-video");
    var scroll_up = document.getElementById("tracklist-video");

    for (var i = 0; i < times_items.length; i++) {
        times_items[i].addEventListener("click", function() {

            seconds = minutesToSeconds($(this).parent(".tracklist-video-time").text().split(" ")[0]);
            changeVideo(seconds);

            $(this).removeClass('tracklist-video-time-active');
            $(this).addClass("tracklist-video-time-active");

            scroll_up.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    function changeVideo(seconds) {
        player.loadVideoById({
            'videoId': VIDEO_TRACKLIST_ID,
            'startSeconds': seconds,
            'suggestedQuality': 'large'
        });
    }

    function minutesToSeconds(time) {
        var playerSeconds = 100,
            timeConvert = time.split(":");
        if (timeConvert.length == 3) {
            playerSeconds = (timeConvert[0] * 360000 / 100) + (timeConvert[1] * 6000 / 100) + parseInt(timeConvert[2]);
        } else if (timeConvert.length == 2) {
            playerSeconds = (timeConvert[0] * 6000 / 100) + parseInt(timeConvert[1]);
        } else {
            playerSeconds = timeConvert[0];
        }
        return playerSeconds;
    };

    /*UTILS */
    function findVideoInYoutube(videoTitle) {
        var api = 'https://www.googleapis.com/youtube/v3/search?q=' 
        + fixedEncodeURIComponent(videoTitle) 
        + '&key=' 
        + API_KEY_YOUTUBE 
        + '&type=video&maxResults=1&part=snippet&fields=items(id)&videoSyndicated=true';

        var request = $.ajax({
            url: api,
            method: "GET",
            dataType: "json",
            cache: true
        });
        request.done(function(result) {
            if (result.items[0]) {
                player.cueVideoById(result.items[0].id.videoId);
                player.playVideo();
            }
            document.getElementById("tracklist-video").scrollIntoView({
                behavior: 'smooth'
            });
        });
        request.fail(function(error) {
            alert("error not video search");
        });
    }


    /* OPTIONS PLAYERS */
    $('#tracklist-video-repeat').on('click', function() {
        if (repeat != true) {
            repeat = true;
            $(this).addClass("tracklist-video-active");
        } else {
            repeat = false;
            $(this).removeClass("tracklist-video-active");
        }
    });

    $(".tracklist-video-youtube").on("click", function() {
        var videoTitle = $(this).parent().text(),
            videoIdReserved = $(this).attr("data-video-id");

            videoIdSearch = videoTitle.replace(/[\d:|\\]/g, "").replace(" ", "");

        $(this).removeClass('tracklist-video-time-active');
        $(this).addClass("tracklist-video-time-active");

        if (videoIdReserved != null) {
            sessionStorage.setItem("videoStorageId", videoIdReserved);
            player.cueVideoById(videoIdReserved);
            player.playVideo();
            scroll_up.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            findVideoInYoutube(videoIdSearch);
        }
    });
    $('#tracklist-video-load').on('click', function() {
        player.cueVideoById(VIDEO_TRACKLIST_ID);
        player.playVideo();
    });

    $("#tracklist-video-float").on('click', function() {
        loadFloatVideo();
    });

    float_player_drag_open.on("click", function() {
        upFloatVideo();
    });

    $(".draggable-btn-down").on("click", function() {
        downFloatVideo();
    });

    $(".draggable-btn-close").on("click", function() {
        closeFloatVideo();
    });

    $("#tracklist-video-playlist").on('click', function() {
        document.getElementsByClassName("tracklist-video-time-active")[0].scrollIntoView({
            behavior: 'smooth'
        });
    });

    function loadFloatVideo() {
        float_player.attr("src", "https://www.youtube.com/embed/" + VIDEO_TRACKLIST_ID + "?autoplay=1");
        player.pauseVideo();
        float_player_drag.show();
        float_player_drag_open.hide();
    }

    function upFloatVideo() {
        float_player_drag.show();
        $(this).hide();
    }

    function downFloatVideo() {
        float_player_drag.hide();
        float_player_drag_open.show();
    }

    function closeFloatVideo() {
        float_player.attr("src", "");
        $(".draggable , .draggable-open").hide();
    }

    function repeatVideo() {
        if (repeat != false) {
            if (player.getCurrentTime() == player.getDuration()) {
                player.playVideo();
            }
        }
    };

    function fixedEncodeURIComponent(videoTitle) {
        return videoTitle.replace(/ /g, "+").replace(/[\&|\\]/g, "-");
    };
}
