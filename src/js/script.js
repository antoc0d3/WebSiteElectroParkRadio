$(document).ready(function () {

var _0x6367=["\x41\x49\x7A\x61\x53\x79\x44\x46\x4B\x43\x54\x62\x65\x72\x32\x4A\x32\x6D\x33\x73\x42\x48\x7A\x5F\x65\x72\x7A\x5F\x33\x62\x78\x57\x47\x4D\x71\x6F\x71\x42\x51","\x63\x68\x61\x74\x2D\x64\x61\x74\x61\x62\x61\x73\x65\x2D\x32\x35\x37\x63\x65\x2E\x66\x69\x72\x65\x62\x61\x73\x65\x61\x70\x70\x2E\x63\x6F\x6D","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x63\x68\x61\x74\x2D\x64\x61\x74\x61\x62\x61\x73\x65\x2D\x32\x35\x37\x63\x65\x2E\x66\x69\x72\x65\x62\x61\x73\x65\x69\x6F\x2E\x63\x6F\x6D","\x63\x68\x61\x74\x2D\x64\x61\x74\x61\x62\x61\x73\x65\x2D\x32\x35\x37\x63\x65\x2E\x61\x70\x70\x73\x70\x6F\x74\x2E\x63\x6F\x6D","\x69\x6E\x69\x74\x69\x61\x6C\x69\x7A\x65\x41\x70\x70"];var config={apiKey:_0x6367[0],authDomain:_0x6367[1],databaseURL:_0x6367[2],storageBucket:_0x6367[3]};firebase[_0x6367[4]](config)

    /*
    var config = {
        apiKey: "AIzaSyDFKCTber2J2m3sBHz_erz_3bxWGMqoqBQ",
        authDomain: "chat-database-257ce.firebaseapp.com",
        databaseURL: "https://chat-database-257ce.firebaseio.com",
        storageBucket: "chat-database-257ce.appspot.com"
    };

    firebase.initializeApp(config);*/

    /* INITIALIZE
    ==============*/
    var db = firebase.database().ref('chat/'),
        connect = firebase.database().ref('connect/'),
        idOnline = localStorage.getItem("idOnline"),
        userData = JSON.parse(sessionStorage.getItem("userData")),
        chatTimeline = $(".chat-timeline"),
        body = $("body"),
        buttonMenu = $(".menumobile"),
        contentArea = $("#content"),
        headers = $("#header"),
        usersConnect = $(".chat-online"),
        chatForm = $("#chat-form"),
        nav = $('#nav'),
        navTrigger = $('#nav-trigger'),
        scrollBotton = ($('.chat-timeline').get(0).scrollHeight, -1),
        btnMenuMovil = $("#menu-close-m"),
        result = $("#loader-content"),
        title = $("title"),
        popupLogin = $('.cd-popup'),
        playerAudio = $('#jplayer_audio'),
        chatLine = $(".chatline"),
        navLabel = $("#nav .nav-label"),
        tabList = $("ul.tabs li"),
        tabListContent = $(".tab_content"),
        chatMessageSend = $("#chat_message_send"),
        tabs = $(".tabs > .tab");


    body.animate({ opacity: 1 }, 5000);

    /* FUNCTIONS 
    ==============*/
    function loaderPage(pathUrl) {
        var request = $.ajax({
            url: pathUrl,
            method: "GET",
            dataType: "html",
            cache: true
        });

        result.html(htmlLoading);
        request.done(function (content) {
            title.text(extractTitle(content));
            result.html(parseContentAjax(content));
            try {
                initializeAjax();
                cleanerStatusMsg();
                tabsFooterInitialize();
                showTabsContentMovil();
                FB.XFBML.parse();
            } catch (error) {
                console.log("not plugging facebook");
            }
        });

        request.fail(function () {
            result.html(htmlReload);
        });
    };

    function initializeAjax() {
        scrollBarActive();    
        $(".tabs .tab:first").click();
    };

    function showTabsContentMovil() {
        if ($(window).width() < 740) {
            $('.tab_content:first').hide();
            $('.tab_content:last').show();
            $("ul.tabs li").removeClass("active");
            $("ul.tabs li:first").addClass("active");
        }
    };

    function clearPathUrl(path_name) {
        return String(path_name.replace('/', '') + ".html");
    };

    function parseContentAjax(content) {
        return content.replace(/[\r\n]/g, ' ').match(/<section class='area'>(.*)<\/section>/)[0];
    };

    function extractTitle(content) {
        return content.match(/<title[^>]*>([^<]+)<\/title>/)[1];
    };

    function htmlLoading() {
        return "<div id='loading-page'><div class='outer'/><div class='inner'/></div>";
    };

    function htmlReload() {
        var urlReload = location.pathname;
        return "<div id='loading-page'><h4>No se pudo cargar la pagina ...</h4><a href='" + urlReload + "' class='label'><button>cargar de nuevo <i class='fa fa-undo'></i> </button></a></div>";
    };

    function sendMessageChat(message) {
        try {
            deleteMessageFirst();
            db.push().set(message);
            chatMessageSend.val("");
            $(".chat-timeline").scrollTop($('.chat-timeline').get(0).scrollHeight, -1);
        } catch (e) {
            alert("hubo un error por favor ingrese de nuevo");
        }
    };

    function deleteMessageFirst() {
        var usersRef = db.orderByKey().limitToFirst(1);
        usersRef.once('value',  function(snapshot) {
            var key = snapshot.A.k.ba.key;
            db.child(key).remove();
        });
    };

    function NiceScrollChange(identify) {
        $(identify).niceScroll({
            cursorcolor: "#879e9f",
            cursoropacitymin: 0.4,
            background: "transparent",
            autohidemode: false,
            cursorborder: "0",
            cursorminheight: 30
        });
    };

    function heightChat() {
        chatTimeline.getNiceScroll().resize();
        chatLine.css({ "height": body.height() - 45 + 'px' });
        chatTimeline.css({ "height": body.height() - 140 + 'px' });
        usersConnect.css({ "height": body.height() - 140 + 'px' });
    };

    function cleanerStatusMsg() {
        var pathname = location.pathname.replace("/p/", "").replace(".html", ""),
            status_msg_wrap = $(".status-msg-wrap:first");

        switch (pathname) {
            case "tracklists": status_msg_wrap.hide();
                break;
            case "eventos": status_msg_wrap.hide();
                break;
            case "noticias": status_msg_wrap.hide();
                break;
            case "videos": status_msg_wrap.hide();
        }
    };

    function tabsFooterInitialize() {
        var tabsContent = $(".tabs-widget-content");
        tabsContent.hide();
        $("#widget-themater_tabs-1432447472-id0").fadeIn();
    };

    function logout() {
        firebase.auth().signOut()
            .then(function () {
                console.log('Ya terminó la sesión')
            }, function (error) {
                console.log(error);
            })
    };

    function messageHtml(index, messages) {
        return '<div class="user-message">'
            + '<div class="user-message-photo">'
            + '<img alt="' + messages[index].imageProfile + '" src=" ' + messages[index].imageProfile + ' ">'
            + '</div>'
            + '<div class="user-message-body">'
            + '<div class="user-message-info">'
            + '<strong class="user-message-name"><i class="fa fa-comment"></i>   ' + messages[index].name + '</strong>'
            + '</div>'
            + '<div class="user-message-content">' + messages[index].message + '</div>'
            + '</div>'
            + '</div>';
    };

    function chatConnects(user, connects) {
        return '<img class="user-message-photo" src=' + connects[user].photoURL + ' title=' + connects[user].displayName + '/>';
    };


    function index() {
        loaderPage("/index.html");
        //$('.imagenpost').parallax("60%", 0.3);
    }

    function shop() {
        loaderPage("/p/tienda.html");
    }

    function tracklists() {
        loaderPage("/search/label/tracklists");
    }

    function events() {
        loaderPage("/search/label/eventos");
    }

    function news() {
        loaderPage("/search/label/noticias");
    }

    function videos() {
        loaderPage("/search/label/videos");
    }

    function live() {
        loaderPage("/p/live.html");
    }

    function notfound() {
        console.log("404 not fount page line 312 doc index.html");
    }

    function post(ctx) {
        var url = "/" + ctx.params.year + '/' + ctx.params.month + '/' + ctx.params.post;
        loaderPage(url);
    }


    /* LIBRARY 
    ==============*/

    page('/', index)
    page('/p/tienda.html', shop)
    page('/p/tracklists.html', tracklists)
    page('/p/eventos.html', events)
    page('/p/noticias.html', news)
    page('/p/videos.html', videos)
    page('/p/live.html', live)
    page('/:year/:month/:post', post);
    /*  page('*', notfound)*/
    page()


    /* EVENTOS 
    ==============*/
    $(window).scroll(function () {
        var height = $(window).scrollTop(),
            fixLogo = $(".fix-logo");
    });

    $(window).mouseover(function () {
        body.getNiceScroll().resize();
    });



    /* DATABASE 
    ==============*/
    db.on('value', function (snapshot) {
        var messages = snapshot.val(),
            messageLast = $(".user-message:last"),
            row = "";
        chatTimeline.empty();
        for (index in messages) {
            row += messageHtml(index, messages);
        }

        chatTimeline.append(row);
        messageLast.hide().fadeIn("slow");
        chatTimeline.scrollTop(scrollBotton);
        row = "";
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    connect.on('value', function (snapshot) {
        var connects = snapshot.val(),
            connectsCountsText = $(".chat-online-count");
        usersConnect.empty();

        var row = "";
        for (user in connects) {
            row += chatConnects(user, connects);
        }

        usersConnect.append(row);
        connectsCounts = $(".chat-online > img").length;
        connectsCountsText.html('<strong><i class="fa fa-user-circle"></i></strong>' + '</p>' + connectsCounts + '</p>');
        row = "";

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    $("#fbLogin").on("click", function () {
        var provider = new firebase.auth.FacebookAuthProvider(),
            msgStatusLogin = $(".text-error.login"),
            popup = $(".cd-popup");

        msgStatusLogin.text();
        firebase.auth().signInWithPopup(provider)
            .then(function (user) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        sessionStorage.setItem("userData", JSON.stringify(user.providerData[0]));
                        localStorage.setItem("idOnline", user.providerData[0].uid);
                        connect.child(user.providerData[0].uid).set(user.providerData[0]);
                    } else {
                        alert("error al connectar.");
                        location.reload();
                    }
                });

                popup.css({ "visibility": "hidden" });
            }, function (error) {
                msgStatusLogin.text("ups... algo salio mal. intente de nuevo");
            })
    });


    chatMessageSend.on("click", function () {
        if (sessionStorage.getItem("userData") == null) {
            $(".cd-popup").addClass("is-visible");
        }
    });

    window.onbeforeunload = function () {
        connect.child(idOnline).remove();
    };

    if (sessionStorage.getItem("userData") != null) {
        connect.child(idOnline).remove();
        connect.child(userData.uid).set(userData);
    }

    $(window).resize(heightChat);
    heightChat();

    popupLogin.on('click', function (event) {
        if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')) {
            event.preventDefault();
            $(this).removeClass('is-visible');
        }
    });

    navTrigger.on('click', function (e) {
        var closed = navTrigger.attr('class').indexOf('close') > 0;
        if (closed) {
            navTrigger.attr('class', 'nav-trigger open');
            nav.attr('class', 'out');

        } else {
            navTrigger.attr('class', 'nav-trigger close');
            nav.attr('class', 'in');
        }
    });

    btnMenuMovil.on("click", function () {
        navTrigger.attr('class', 'nav-trigger open');
        nav.attr('class', 'out');
    });

    navLabel.on("click", function () {
        navTrigger.attr('class', 'nav-trigger open');
        nav.attr('class', 'out');
    });

    tabs.on("click", function () {
        tabs.removeClass("active");
        $(this).addClass("active");
    });

    $(document).keyup(function (event) {
        if (event.which == '27') {
            popupLogin.removeClass('is-visible');
        }
    });

    chatForm.validate({
        rules: {
            chat_message_send: {
                required: true,
                minlength: 1,
                maxlength: 99
            },
        },
        messages: {
            chat_message_send: {
                required: "",
                minlength: "Es necesario escribir caracteres.",
                maxlength: "Maximo de caracteres 99 por mensaje."

            }
        }
    });

    chatTimeline.scrollTop(scrollBotton);

    chatMessageSend.keypress(function (e) {
        if (this.value.length == 99) {
            e.preventDefault();
        } else if (this.value.length > 99) {
            this.value = this.value.substring(0, 99);
        }
    });

    $(window).resize(function () {
        resizeContent();
    });

    chatForm.keypress(function (e) {
        if (e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            var message = messageChat();
            var valid = validateMessageChat(message);
            if (valid == true) {
                sendMessageChat(message)
            }
        }
    });

    function messageChat() {
        var user = JSON.parse(sessionStorage.getItem("userData")),
            message = chatMessageSend.val(),
            result;

        if (user != null) {
            result = {
                name: user.displayName,
                message: message,
                imageProfile: "https://graph.facebook.com/" + user.uid + "/picture?type=square"
            }
        } else {
            result = null;
        }

        return result;
    };

    function resizeContent() {
        if ($(window).width() > 991) {
            $('#tab2, #tab1').show();
            $('.tabs').hide();
        } else {
            detectTabShowContent().hide();
            $('.tabs').show();
        }
    }

    function detectTabShowContent() {
        var activeTab = $(".tabs > li.active").text();
        switch (activeTab) {
            case "WEB": return $('#tab2');
                break;
            case "CHAT": return $('#tab1');
        }
    }

    function validateMessageChat(message) {
        if (chatForm.valid() == true && message != null) {
            return true;
        }
    }

    function lowScrollChat() {
        chatTimeline.scrollTop($('.chat-timeline').get(0).scrollHeight, -1);
    }

    function textColorValidateChat() {
        return chatMessageSend;
    }

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_ES/sdk.js#xfbml=1&version=v2.12&appId=1466024870318151&autoLogAppEvents=1';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    $(".tab_content").hide();
    $(".tab_content:last").show();

    tabList.click(function () {
        tabList.removeClass("active");
        $(this).addClass("active");
        tabListContent.hide();
        $("#" + $(this).attr("rel")).fadeIn();
        scrollBarActive();
    });

    if ($(window).width() > 991) {
        resizeContent();
    }

    function scrollBarActive() {
        if ($(window).width() > 991) {
        NiceScrollChange(".chat-timeline , body");
       // $('.imagenpost').parallax("60%", 0.3);
        }
    }


    playerAudio.jPlayer({
        ready: function(event) {
            $(this).jPlayer("setMedia", {
                mp3: "http://87.98.153.24:80/mxHD.mp3/;",
            }).jPlayer("play");
        },
        timeupdate: '',
        durationchange: '',
        cssSelectorAncestor: '#jp_gui_audio',
        cssSelector: {
            currentTime: ''
        },
        swfPath: 'lib',
        supplied: 'mp3',
        autoPlay: true,
        smoothPlayBar: true,
        keyEnabled: true,
        wmode: 'window'
    });

    var $draggable = $('.draggable').draggabilly({
        handle: '.handle'
    });

    $('.player-stick').stickit();
    $('.player-control').menu();

    scrollBarActive();
    tabsFooterInitialize();


function log(text) {
  console.log(text);
}

/*  escribir sobre el core de Jquery
        (function($) {
        $.fn.invisible = function() {
            return this.each(function() {
                $(this).css("visibility", "hidden");
            });
        };
        $.fn.visible = function() {
            return this.each(function() {
                $(this).css("visibility", "visible");
            });
        };
    }(jQuery)); */

});
