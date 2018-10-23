class SCFilms {
    constructor() {
        // 1 - no; 2 - seasonvar; 3 - coldfilm;
        this.isFilm = 1;

        chrome.browserAction.setBadgeBackgroundColor({ color: '#ff0000' });

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.active) {
                this.checkFilms(tab);
            }
        });

        chrome.tabs.onActivated.addListener((activeInfo) => {
            chrome.tabs.get(activeInfo.tabId, (tab) => {
                this.checkFilms(tab);
            });
        });

        chrome.browserAction.onClicked.addListener((tab) => {
            // для Sesonvar
            if (this.isFilm === 2) {
                this.badgeShow();
                // получение video с основной вкладки
                let code_ = 'document.querySelector(\'video\').currentSrc;';
                chrome.tabs.executeScript(tab.id, { code: code_ }, (res) => {
                    // проверка что есть ссылка на video
                    if (res[0] !== null) {
                        this.seasonvarHD(res[0]);
                    } else {
                        let code_ = 'alert(\'A different player is in use, or the video is not loaded\');';
                        chrome.tabs.executeScript(tab.id, { code: code_ });
                        this.badgeHide();
                    }
                });
            // для ColdFilm
            } else if (this.isFilm === 3) {
                this.badgeShow();
                // запрос к api
                let url = 'https://serial.koljasha.ru/api/?coldfilm=' + tab.url;
                this.fetch_(url)
                    .then((response) => {
                        response.json()
                            .then((body) => {
                                if (body.length > 0) {
                                    for (let i of body) {
                                        this.newTab(i);
                                    }
                                } else {
                                    let code_ = 'alert(\'A different player is in use, or the video is not loaded\');';
                                    chrome.tabs.executeScript(tab.id, { code: code_ });
                                }
                                this.badgeHide();
                            });
                    })
                    .catch((error) => {
                        let code_ = `alert('${error}');`;
                        chrome.tabs.executeScript(tab.id, { code: code_ });
                        this.badgeHide();
                    });
            }
        });

        //контекстное меню
        chrome.contextMenus.removeAll();

        chrome.contextMenus.create({
            title: 'Разблокировать',
            documentUrlPatterns: ['http://seasonvar.ru/serial-*']
        });

        chrome.contextMenus.onClicked.addListener((info, tab) => {
            chrome.tabs.create({ url: 'http://datalock.ru/player/' + info.pageUrl.split('-')[1] });
        });
    }

    // fetch with timeout
    fetch_(url, options, timeout = 10000) {
        return Promise.race([
            fetch(url, options),
            new Promise((resolve, reject) =>
                setTimeout(() => reject(new Error('timeout')), timeout)
            )
        ]);
    }

    // открываем HD seasonvar
    seasonvarHD(url) {
        let str_ = url;
        let strArr = str_.split('/');
        str_ = strArr[5];
        str_ = 'hd' + str_.substring(2);
        strArr[5] = str_;

        // 1 server HD
        strArr[2] = 'data-hd.datalock.ru';
        str_ = strArr.join('/');
        this.fetch_(str_, { method: 'HEAD' })
            .then((response) => {
                if (response.status === 200) {
                    this.newTab(str_);
                    this.badgeHide();
                } else {
                    // 2 server HD
                    strArr[2] = 'data-hd-temp.datalock.ru';
                    str_ = strArr.join('/');
                    this.fetch_(str_, { method: 'HEAD' })
                        .then((response) => {
                            if (response.status === 200) {
                                this.newTab(str_);
                                this.badgeHide();
                            }
                            else {
                                // нет HD
                                this.newTab(url);
                                this.badgeHide();
                            }
                        });
                }
            })
            .catch(() => {
                this.newTab(url);
                this.badgeHide();
            });
    }

    // проверка вкладки для ссылок
    checkFilms(tab) {
        let isSeasonvar = /http:\/\/seasonvar.ru\/serial-/.test(tab.url);
        let isColdfilm = /http:\/\/coldfilm.cc\/news\//.test(tab.url);
        if ((isSeasonvar || isColdfilm) && tab.active) {
            chrome.browserAction.setIcon({ 'path': 'icon_16.png' });
            this.isFilm = isSeasonvar ? 2 : 3;
        } else {
            chrome.browserAction.setIcon({ 'path': 'icon_16_def.png' });
            this.isFilm = 1;
        }
    }

    // дополнительные функции
    badgeShow() {
        chrome.browserAction.setBadgeText({ text: '⌛' });
    }

    badgeHide() {
        chrome.browserAction.setBadgeText({ text: '' });
    }

    newTab(url) {
        chrome.tabs.create({ 'url': url }, (tab) => {
            //инъекция скрипта для перемотки
            let code_ = `
const body = document.querySelector('body');
const script = document.createElement('script');
script.innerHTML = \`
window.onload = () => {

    const video = document.querySelector('video');

    //disable fo Firefox
    video.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
        }
    });

    //main listener
    addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            if (video.currentTime + 30 <= video.duration) {
                video.currentTime += 30;
            } else {
                video.currentTime = video.duration;
            }
        } else if (event.key === 'ArrowLeft') {
            if (video.currentTime - 30 >= 0) {
                video.currentTime -= 30;
            } else {
                video.currentTime = 0;
            }
        }
    });

};
\`;
body.append(script);
            `;
            chrome.tabs.executeScript(tab.id, { code: code_ });
        });
    }
}

const sc = new SCFilms();
