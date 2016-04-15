require('./errors.css');

document.getElementsByClassName('errors__close')[0].addEventListener('click', closeErrors, false);

function closeErrors() {
    document.getElementsByClassName('errors')[0].classList.add('errors_hidden');
}
