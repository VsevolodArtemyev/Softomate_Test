"use strict";

import '../../less/injectedPic.less';

const GOOGLE_SEARCH_RESULTS = '#center_col .ads-ad, #center_col ._NId .rc';
const BING_SEARCH_RESULTS = '.b_ad li, .b_algo';

chrome.runtime.onMessage.addListener(message => {
    let {action, data} = message;
    if (action !== 'injectPic') {
        return;
    }

    let host = window.location.host;

    if (~host.search(/google\.[com|ru]/)) {
        afterContentLoaded(injectPic.bind(null, GOOGLE_SEARCH_RESULTS, data));
    } else if (~host.search(/bing\.com/)) {
        injectPic(BING_SEARCH_RESULTS, data);
    }
});

/**
 * Осуществляет инъекцию картинки в результаты поиска
 * @param {String} searchSelector - строка-селектор для поиска мест для внедрения
 * @param {Object} employeesList - набор сайтов для которых необходимо отображать картинку в результатах поиска
 */
function injectPic (searchSelector, employeesList) {
    let searchResults = document.querySelectorAll(searchSelector);

    [].forEach.call(searchResults, searchRes => {
        // В рекламных блоках ссылка может содержать теги, например http://www.<b>yandex</b>.ru
        let searchResultURL = searchRes.querySelector('cite').innerHTML.replace(/<.+?>/g, '');

        let isAcceptable = employeesList.some(emp => ~searchResultURL.search(emp.domain));
        if (!isAcceptable) {
            return;
        }

        let pic = document.createElement('img');
        pic.classList = ["pic"];
        pic.setAttribute('src', chrome.extension.getURL('img/icon.png'));

        searchRes.firstChild.appendChild(pic);
    });
}

/**
 * Производит проверку на неободимые обновления на странице, т.к. при открытии более двух вкладок с гуглом лисенер
 * tabs.onUpdate срабатывает раньше, чем контент страницы полностью загрузится. (При работе с webhp)
 *
 * @param {Function} callback - колбэк, который будет вызван после обновления страницы
 */
function afterContentLoaded (callback) {
    let checktimer = setInterval(() => {
        if (document.querySelector('.gsfi')) {
            clearInterval(checktimer);
            callback();
        }
    }, 100);
}