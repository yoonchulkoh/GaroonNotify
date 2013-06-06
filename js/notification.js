chrome.extension.sendRequest({id: location.hash.slice(1)}, function (item) {
    var div = $('<div/>').attr('style', 'font-size:12px').appendTo('#main');
    for (i = 0; i < item.length; i++) {
        $('<img/>').attr('src', item[i].src).attr('border', 'none').attr('style', 'width:20px;height:20px;border:none;').appendTo(div);
        $('<a/>').attr('href', item[i].url).attr('target', '_brank').text(item[i].text).appendTo(div);
        $('<br/>').appendTo(div);
    }
    setTimeout(function () {
        window.close();
    }, Number(localStorage["displayTime"]) * 1000);
});