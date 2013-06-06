// Saves options to localStorage.
var save_options = function () {
    // URL
    var select = document.getElementById("url");
    var url = select.value;
    if (!url) {
        alert("GaroonのトップページURLを入力してください。");
        return;
    }
    localStorage["garoon_url"] = url;

    // 監視対象
    var guards = [];
    $("[name='guard_target']:checked").each(function () {
        guards.push($(this).val());
    });
    localStorage["guards"] = guards;

    // アラート間隔
    localStorage["interval"] = $("#interval").val();

    // 表示時間
    localStorage["displayTime"] = $("#displayTime").val();


    // Update status to let user know options were saved.
    $("#status").text("Options Saved.");
    setTimeout(function () {
        $("#status").text("");
    }, 750);

    // 通知開始
    setTimeout(function () {
        chrome.extension.getBackgroundPage().notifyStart();
    }, 1);
}

// Restores select box state to saved value from localStorage.
var restore_options = function () {
    $("#save").bind("click", save_options);

    // URL
    var url = localStorage["garoon_url"];
    var select = document.getElementById("url");
    select.value = url;

    // 監視対象
    var guards = localStorage["guards"];
    var array_guards = guards.split(",");
    $('[name="guard_target"]').each(function () {
        for (var i in array_guards) {
            if ($(this).val() === array_guards[i]) {
                $(this).attr('checked', 'checked');
                break;
            } else {
                $(this).attr('checked', false);
            }
        }
    });

    // アラート間隔
    var interval = localStorage["interval"];
    $("#interval").val(interval);

    // 表示時間
    var displayTime = localStorage["displayTime"];
    $("#displayTime").val(displayTime);
}

window.onload = restore_options;