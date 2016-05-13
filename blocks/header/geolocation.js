'use strict';

import {showError} from '../errors/scripts/clientErrors.js';

(function setUserCity() {
    if (document.cookie.indexOf('userCity') >= 0) {
        return;
    }

    if (!navigator.geolocation) {
        showError({ text: 'Похоже, ваш браузер не поддерживает геолокацию :с' });
        return;
    }
    const options = {
        enableHighAccuracy: false,
        maximumAge: 50000,
        timeout: 10000
    };

    navigator.geolocation.getCurrentPosition(
        getUserCity,
        (error) => {
            showError({ text: 'Не удалось получить ваше местоположение' });
        },
        options
    );

})();

function getUserCity(position) {
    const point = new YMaps.GeoPoint(position.coords.longitude, position.coords.latitude);
    const geocoder = new YMaps.Geocoder(point, { result: 1 });

    YMaps.Events.observe(geocoder, geocoder.Events.Load, function () {
        if (this.length()) {
            const city = this.get(0).AddressDetails.Country.AdministrativeArea
                .SubAdministrativeArea.Locality.LocalityName;
            document.cookie = `userCity=${city};`;

        }
    });

    YMaps.Events.observe(geocoder, geocoder.Events.Fault, (geocoder, error) => {
        showError({ text: 'Не удалось получить ваше местоположение' });
    });
}
