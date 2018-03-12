var player, time_update_interval, repeat, VIDEO_TRACKLIST_ID;

time_update_interval = 0;
repeat = false;
VIDEO_TRACKLIST_ID = $("#tracklist-video").attr("data-video-id");

$("#tracklist-video").append('<div id="video-placeholder"></div>'
    + '<div id="video-options">'
    + '<button class="button button-outlined button-small block-mobile" id="tracklist-video-playlist"><i class="fa fa-mouse-pointer"></i>  Bajar</button>'
    + '<button class="button button-outlined button-small block-mobile" id="tracklist-video-load"><i class="fa fa-list-ul"></i> Tracklist</button>'
    + '<button class="button button-outlined button-small block-mobile" id="tracklist-video-float"><i class="fa fa-window-restore"></i> Flotar</button>'
    + '<button class="button button-outlined button-small block-mobile" id="tracklist-video-repeat"><i class="fa fa-undo"></i> Repetir</button>'
    + '</div>');

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: VIDEO_TRACKLIST_ID,
        playerVars: {

        },
        events: {
            onReady: initialize
        }
    });
}


function initialize() {
    /*  
        updateTimerDisplay();
        updateProgressBar();
    */
    clearInterval(time_update_interval);

    time_update_interval = setInterval(function () {
        /* 
            updateTimerDisplay();
            updateProgressBar();
        */
        repeatVideo();
    }, 1000);

    $('#volume-input').val(Math.round(player.getVolume()));

    $(".tracklist-video-youtube").on("click", function () {
        var videoTitle = $(this).parent().text(),
            videoIdReserved = $(this).attr("data-video-id");
        videoIdSearch = videoTitle.replace(/[\d:|\\]/g, "").replace(" ", "");

        $(".tracklist-video-youtube").removeClass('tracklist-video-time-active');
        $(this).addClass("tracklist-video-time-active");

        if (videoIdReserved != null) {
            sessionStorage.setItem("videoStorageId", videoIdReserved);
            player.cueVideoById(videoIdReserved);
            player.playVideo();
            document.getElementById("tracklist-video").scrollIntoView({ behavior: 'smooth' });
        } else {
            findVideo(videoIdSearch);
        }
    });

    $("#tracklist-video-playlist").on('click', function () {
        document.getElementsByClassName("tracklist-video-time-active")[0].scrollIntoView({ behavior: 'smooth' });
    });

    /*
    $('a').on('click', function(){
        if(player.getCurrentTime() != 0){
            loadFloatVideo();
            sessionStorage.setItem("floatVideoUrl", location.pathname);
        }else {
            closeFloatVideo();
        }
    });
    */
}

function updateTimerDisplay() {
    $('#current-time').text(formatTime(player.getCurrentTime()));
    $('#duration').text(formatTime(player.getDuration()));
}


function updateProgressBar() {
    $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
}

$('#progress-bar').on('mouseup touchend', function (e) {
    var newTime = player.getDuration() * (e.target.value / 100);
    player.seekTo(newTime);

});

$('#play').on('click', function () {
    player.playVideo();
    $("#float-player-youtube").attr("src", "");
});

$('#pause').on('click', function () {
    player.pauseVideo();
});

$('#tracklist-video-repeat').on('click', function () {
    if (repeat != true) {
        repeat = true;
        $(this).addClass("tracklist-video-active");
    } else {
        repeat = false;
        $(this).removeClass("tracklist-video-active");
    }

});

$('#tracklist-video-load').on('click', function () {
    player.cueVideoById(VIDEO_TRACKLIST_ID);
    player.playVideo();
});


$("#tracklist-video-float").on('click', function () {
    loadFloatVideo();
});

$(".draggable-open").on("click", function () {
    upFloatVideo();
});


$(".draggable-btn-down").on("click", function () {
    downFloatVideo();
});

$(".draggable-btn-close").on("click", function () {
    closeFloatVideo();
});

function loadFloatVideo() {
    $("#float-player-youtube").attr("src", "https://www.youtube.com/embed/"
        + VIDEO_TRACKLIST_ID + "?autoplay=1");
    player.pauseVideo();
    $(".draggable").show();
    $(".draggable-open").hide();
}

function upFloatVideo() {

    $(".draggable").show();
    $(this).hide();
}

function downFloatVideo() {
    $(".draggable").hide();
    $(".draggable-open").show();
}

function closeFloatVideo() {
    $("#float-player-youtube").attr("src", "");
    $(".draggable , .draggable-open").hide();
}



//SetVideo
function findVideo(videoTitle) {
    var api = 'https://www.googleapis.com/youtube/v3/search?q='
        + fixedEncodeURIComponent(videoTitle)
        + '&key=AIzaSyCg3zJWDqBF8rAGGHfP-1UPwoVmzvSDxxI&type=video&maxResults=1&part=snippet&fields=items(id)&videoSyndicated=true';
    var request = $.ajax({
        url: api,
        method: "GET",
        dataType: "json",
        cache: true
    });

    request.done(function (result) {
        if (result.items[0]) {
            player.cueVideoById(result.items[0].id.videoId);
            player.playVideo();
        }
        document.getElementById("tracklist-video").scrollIntoView({ behavior: 'smooth' });
    });

    request.fail(function (error) {
        alert("error not video search");
    });
}

function fixedEncodeURIComponent(videoTitle) {
    return videoTitle.replace(/ /g, "+").replace(/[\&|\\]/g, "-");
};

$(".tracklist-set-video").click(function () {
    var $this = $(this);
    try {
        player.cueVideoById(VIDEO_TRACKLIST_ID);
        setTimeVideo($this.parent(".tracklist-video-time").text().split(" ")[0]);
        $this.removeClass('tracklist-video-time-active');
        $this.addClass("tracklist-video-time-active");
        document.getElementById("tracklist-video").scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert("espere a que el reproductor se carge correctamente.");
    }
});

function repeatVideo() {
    if (repeat != false) {
        if (player.getCurrentTime() == player.getDuration()) {
            player.playVideo();
        }
    }
};


// Set Time video
function setTimeVideo(time) {
    var playerSeconds,
        timeConvert = time.split(":");

    if (timeConvert.length == 3) {
        playerSeconds = (timeConvert[0] * 360000 / 100) + (timeConvert[1] * 6000 / 100) + parseInt(timeConvert[2]);
    }
    else if (timeConvert.length == 2) {
        playerSeconds = (timeConvert[0] * 6000 / 100) + parseInt(timeConvert[1]);
    } else {
        playerSeconds = timeConvert[0];
    }
    player.seekTo(playerSeconds);
};


// Helper Functions
function formatTime(time) {
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
};