require('./header.css');
require('./geolocation.js');

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (document.cookie.indexOf('userCity') >= 0) {
    $('.city-select__current-city').html(getCookie('userCity'));
}
