"use strict";

import '../../less/showMessage.less';
import _message_ from '../../jade/showMessage.jade';

chrome.runtime.onMessage.addListener(message => {
    let {action, data} = message;

    switch (action) {
        case 'showMessage':
            showMessage(data);
            break;

        case 'hideMessage': { // Убирает сообщение если при поиске в гугле используется webhp
            let msg = document.querySelector('.SME_msgWrapper');
            if (msg) {
                document.body.removeChild(msg);
            }
        }
    }
});

/**
 * Показывает сообщение при открытии (обновлении) сайта
 * @param {String} message - тест сообщения
 */
function showMessage (message) {
    let msg = document.createElement('div'); // Обертка для шаблона сообщения
    msg.classList = ['.SME_msgWrapper'];
    msg.innerHTML = _message_({
        picURL: chrome.extension.getURL('img/close.png'),
        message
    });

    document.body.insertBefore(msg, document.body.firstChild);

    let closeMsg = document.querySelector('.msg .msg-close');
    closeMsg.addEventListener('click', closeMessage);
}

/**
 * Закрывает сообщение
 */
function closeMessage () {
    document.querySelector('.msg .msg-close').removeEventListener('click', closeMessage);

    document.body.removeChild(document.body.firstChild);
    chrome.runtime.sendMessage(null, 'onClose');
}