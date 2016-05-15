import {showError} from '../errors/scripts/clientErrors';
const geolib = require('geolib');

if (!navigator.geolocation) {
    alert('here');
    showError({ text: 'Ваш браузер не поддерживает геолокацию' });
} else {
    console.log('here');
    $('button').on('click', function () {
        const latitude = parseFloat($(this).next().val()) || 56.8353;
        const longitude = parseFloat($(this).next().next().val()) || 60.5901;
        const id = parseInt($(this).next().next().next().val() || 1);
        const coords = {
            latitude,
            longitude
        };
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const currentCoords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                const distance = geolib.getDistance(currentCoords, coords); // В метрах
                if (distance <= 100) {
                    const data = {

                    };
                }
            },
            function (err) {
                showError(
                    { text: 'Извините, мы не смогли получить данные о местоположении' }
                );
            },
            {
                enableHighAccuracy: true
            }
        );
    });
}
