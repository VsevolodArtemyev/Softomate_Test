"use strict";

/**
 * Хелпер для выполнения запросов к серверу
 * @param {String} url - адрес
 * @param {String} [type] - тип запроса
 * @param {Object|String} [data] - данные для передачи
 * @param {Array} [headers] - заголовки
 *
 * @returns {Promise}
 */
export function ajax({url, type = 'GET', data = null}, headers = []) {
    if (!url) {
        throw new Error({message: 'required "URL" in request options'});
    }

    let xhr = new XMLHttpRequest();
    xhr.open(type, url, true); // Синхронные запросы не поддерживаются

    headers.forEach(header => xhr.setRequestHeader(header.name, header.value));

    xhr.send(data);

    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }

            switch (xhr.status) {
                case 200:
                    resolve(JSON.parse(xhr.responseText));
                    break;

                default:
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
            }
        }
    });
}

/**
 * Реализует гет запрос
 * @param {String} url - адрес
 * @param {Array} [headers] - заголовки
 *
 * @returns {Promise}
 */
export function get(url, headers) {
    return ajax({url}, headers);
}

/*
export function post(url, data, headers) {
    return ajax({url, type: 'POST', data}, headers);
}*/
