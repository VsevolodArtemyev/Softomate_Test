"use strict";

import _popup_ from '../jade/popup.jade';
import '../less/popup.less';

let employeesList = chrome.extension.getBackgroundPage().shareEmployeesList();
document.body.innerHTML = _popup_({employeesList});

document.querySelector('.popup').addEventListener('click', event => {
    if (!event.target.parentElement.classList.contains('site-link')) {
        return;
    }

    chrome.runtime.sendMessage(null, event.target.getAttribute('href'));
});