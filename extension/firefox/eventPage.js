// fetch with timeout
let fetch_ = function(url, options, timeout = 10000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}

// получение hd ссылки на seasonvar
let seasonvar_hd = function(url) {
    let str_ = url;
    let str_Arr = str_.split('/');
    str_Arr[2] = "data-hd.datalock.ru";
    str_ = str_Arr[5];
    str_ = "hd" + str_.substring(2);
    str_Arr[5] = str_;
    str_ = str_Arr.join('/');
    return str_;
}

// работа с Badge
chrome.browserAction.setBadgeBackgroundColor({
    color: '#ff0000'
});

let badgeShow = function() {
    chrome.browserAction.setBadgeText({
        text: 'Load'
    });
}

let badgeHide = function() {
    chrome.browserAction.setBadgeText({
        text: ''
    });
}

let newTab = function(url) {
    chrome.tabs.create({
        "url": url
    });
}

// основной скрипт
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tab) {
        let testurl = tab[0].url;
        // проверка, что сериал seasonvar
        let regex = /http:\/\/seasonvar.ru\/serial-/;
        if (regex.test(testurl)) {
            badgeShow();
            // получение video с основной вкладки
            let code_ = "document.querySelector('video').currentSrc;";
            chrome.tabs.executeScript(tab.id, { code: code_ }, function(res) {
                // проверка что есть ссылка на video
                if (res[0] !== null) {
                    let url = seasonvar_hd(res[0]);
                    // запрос, доступен ли hd
                    fetch_(url, {
                            method: "HEAD",
                        })
                        .then(function(response) {
                            if (response.status !== 200) {
                                url = res[0];
                            }
                            newTab(url);
                            badgeHide();
                        })
                        .catch(function(error) {
                            newTab(res[0]);
                            badgeHide();
                        });
                }
            });
        }
        // проверка, что сериал coldfilm
        regex = /http:\/\/coldfilm.cc\/news\//;
        if (regex.test(testurl)) {
            badgeShow();
            // запрос к api
            let url = "https://serial.koljasha.ru/api/?coldfilm=" + testurl;
            fetch_(url)
                .then(function(response) {
                    response.json()
                        .then(function(body) {
                            if (body.length > 0) {
                                for (let i of body) {
                                    newTab(i);
                                }
                            } else {
                                console.log("A different player is in use, or the video is not loaded.");
                            }
                            badgeHide();
                        })
                })
                .catch(function(error) {
                    console.log(error);
                    badgeHide();
                })
        }
    });

});