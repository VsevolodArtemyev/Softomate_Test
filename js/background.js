"use strict";

import {get} from './helpers/xhr';
import _message_ from '../jade/showMessage.jade';

const EMP_LIST_URL = 'http://www.softomate.net/ext/employees/list.json';
const MAX_VISITS_COUNT = 3;

let employeesList = {};

chrome.tabs.onUpdated.addListener((id, info, tab) => {
    if (info.status === 'complete') {
        console.log(id + ' UPDATED');
        // Асинхронная работа вызывает ошибки
        showMessage(id, info, tab).then(
            () => injectPic(id, info, tab)
        );
    }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
    let isMsgFromPopup = ~sender.url.search(`${sender.id}/popup.html`);

    if (isMsgFromPopup) {
        chrome.tabs.create({url: msg});
    } else {
        let emp = employeesList.find(item => ~sender.tab.url.search(new RegExp(`http(s)?:\\/\\/www\\.${item.domain}`)));
        sessionStorage.setItem(emp.name, '3');
    }
});

function getEmployeesList () {
    get(EMP_LIST_URL).then(
        response => {
            employeesList = response;
        },
        error => {
            throw new Error(error);
        }
    );
}

chrome.alarms.create('getData', {when: Date.now(), periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(alarm => getEmployeesList());

/**
 * Инициирует отображение сообщения при посещении сайста из списка
 * @param {Number} id - идентификатор вкладки
 * @param {Object} info - информация
 * @param {Object} tab - данные по вкладке
 * @returns {*}
 */
function showMessage (id, info, tab) {
    if (!employeesList.length) {
        return Promise.resolve();
    }

    let emp = employeesList.find(item => ~tab.url.search(new RegExp(`http(s)?:\\/\\/www\\.${item.domain}`)));
    if (!emp) {
        return Promise.resolve();
    }

    let visitsCount = +sessionStorage.getItem(emp.name);

    return new Promise((resolve, reject) => {
        // Если было открыто более трех вкладок за сессию или одно из сообщений было закрыто - выходим
        if (visitsCount < MAX_VISITS_COUNT) {
            sessionStorage.setItem(emp.name, ++visitsCount);

            chrome.tabs.executeScript(id, {file: 'src/showMessage.min.js'},
                () => (chrome.tabs.sendMessage(tab.id, {action: 'showMessage', data: emp.message}, () => resolve()))
            );
        } else {
            // Скрываем сообщение, на случай, если оно отображается (в случае рантайм поиска в гугле)
            chrome.tabs.executeScript(id, {file: 'src/showMessage.min.js'},
                () => (chrome.tabs.sendMessage(tab.id, {action: 'hideMessage'}, () => resolve()))
            );
            resolve();
        }
    });
}

function injectPic (id, info, tab) {
    if (~tab.url.search(/google\.[com|ru]|bing\.com/)) {
        chrome.tabs.sendMessage(id, {action: 'injectPic', data: employeesList});
    }
}

/**
 * Геттер для popup
 * @returns {{}}
 */
window.shareEmployeesList = () => employeesList;
