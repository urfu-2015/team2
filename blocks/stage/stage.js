import {showError} from '../errors/scripts/clientErrors';

if (!navigator.geolocation) {
    showError({ text: 'Ваш браузер не поддерживает геолокацию' });
} else {
    showError({ text: 'Ваш браузер поддерживает геолокацию' });
}
