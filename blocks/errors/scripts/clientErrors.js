'use strict';

const renderErrorBlock = require('../../error/error.hbs');
const renderErrorsBlock = require('./../errors.hbs');
import setCloseEvent from './setErrorCloseEventHandler.js';

export const showError = (error) => {
    let errorsBlock = document.querySelector('.errors');

    if (errorsBlock) {
        errorsBlock.classList.remove('errors_hidden');
    } else {
        document.querySelector('.errors-wrapper').innerHTML = renderErrorsBlock();
        errorsBlock = document.querySelector('.errors');
    }
    errorsBlock.innerHTML += renderErrorBlock(error);
    setCloseEvent();
};
