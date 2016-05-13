'use strict';

function closeErrors() {
    document.getElementsByClassName('errors')[0].classList.add('errors_hidden');
    document.querySelector('.errors-wrapper').innerHTML = '';
}

export default () => {
    const closeButton = document.getElementsByClassName('errors__close');

    if (closeButton.length > 0) {
        closeButton[0].addEventListener('click', closeErrors, false);
    }
};
