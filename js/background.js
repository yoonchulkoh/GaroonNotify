// 初期化

var item = [];
var notification;
var uIcons;
var garoon_url;
var baseURL;
var timer;

$ = jQuery.noConflict();
$(function () {
    var isfirstTime = !localStorage["isNotFirstTime"];
    if (isfirstTime) {
        localStorage["garoon_url"] = "";
        localStorage["guards"] = "msg20_u.gif,msg20_u_clip8.gif,bulletin20_u.gif,bulletin20_u_clip8.gif,bulletin_clip30x20_u.gif,event20.gif,report20_u.gif,telmemo20_u.gif";
        localStorage["interval"] = "180";
        localStorage["displayTime"] = "20";
        chrome.tabs.create({url: "options.html"});
        localStorage["isNotFirstTime"] = false;
    }
//    notifyStart();
});

function notifyStart() {
    var res = notify();
    if (res) {
        clearInterval(timer);
        timer = setInterval(function () {
            notify();
        }, Number(localStorage["interval"]) * 1000);
    }
}

function init() {
    garoon_url = localStorage["garoon_url"];
    if (!garoon_url) {
        console.log("url未設定");
    }
    if (garoon_url) {
        baseURL = garoon_url.match("https:\/\/[0-9\.]+\/");
    }
}

function notify() {
    console.log('start notify()');
    if (!localStorage["garoon_url"]) {
        console.log("URLが入力されていません。");
        return false;
    }
    uIcons = localStorage["guards"].split(",");
    init();
    item = [];
    $.ajax({
        url: garoon_url,
        dataType: "html",
        async: false,
        success: function (data) {
            showNotification(data);
        }
    });
    return true;
}

function showNotification(data) {
    console.log('start showNotification()');
    var element = document.createElement('div');
    console.log(data);
    element.innerHTML = data;
    var title = element.getElementsByTagName('title').item(0);

    if (title.innerText != "トップページ") {
        console.log('未ログイン');
        return;
    }

    var img = element.getElementsByTagName('img');
    var infoTextMap = new Array();
    var itemCnt = 0;
    for (var i = 0; i < img.length; i++) {
        if (isUpdateIcon(img.item(i).src)) {
            var childImg = img.item(i);
            var parent = childImg.parentNode;
            var chromeHost = "chrome-extension://" + location.host + "/"
            var url = parent.href.replace(chromeHost, baseURL);
            var src = childImg.src.replace(chromeHost, baseURL);
            var infoText = parent.textContent;
            if ($.inArray(infoText, infoTextMap) < 0) {
                item[itemCnt] = {src: src, url: url, text: infoText};
                infoTextMap.push(infoText);
                itemCnt++;
            }
        }
    }
    if (item.length == 0) {
        console.log('未更新');
        return;
    }
    notification = webkitNotifications.createHTMLNotification('notification.html');
    notification.show();
}

chrome.extension.onRequest.addListener(function (message, sender, sendResponse) {
    console.log(item);
    sendResponse(item);
});

function isUpdateIcon(s) {
    for (var i = 0; i < uIcons.length; i++) {
        if (s.indexOf(uIcons[i]) >= 0) {
            return true;
        }
    }
    return false;
}