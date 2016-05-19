require('./stageEditor.css');
const mapFunctions = require('../map/map.js');
const EXIF = require('../../scripts/exif.js');

module.exports.setScripts = function (element) {
    setImageSelectHandler(element);
    setRemoveHandler(element);
    setGeolocationHandler(element);
};

module.exports.getStageData = function (element) {
    var filePreview = element.querySelector('.photo-editor__preview');
    var nameInput = element.querySelector('.description-editor__title');
    var descriptionInput = element.querySelector('.description-editor__hint');

    var data = {
        file: filePreview.getAttribute('src'),
        name: nameInput.value,
        description: descriptionInput.value,
        geolocation: module.exports.getGeolocation(element)
    };

    var stageId = module.exports.getStageId(element);

    if (stageId !== '') {
        data.id = stageId;
        data.edited = true;

        if (!data.file.startsWith('data:image')) {
            delete data.file;
        }
    }

    return data;
};

module.exports.getStageId = function (element) {
    return element.dataset.stageId;
};

module.exports.getGeolocation = function (element) {
    let geolocationEditor = element.querySelector('.geolocation-editor');

    if (geolocationEditor.dataset.longitude === '' ||
        geolocationEditor.dataset.latitude === '') {

        return undefined;
    }

    return {
        longitude: parseFloat(geolocationEditor.dataset.longitude),
        latitude: parseFloat(geolocationEditor.dataset.latitude)
    };
};

module.exports.setGeolocation = function (element, geolocation) {
    let geolocationEditor = element.querySelector('.geolocation-editor');

    geolocationEditor.dataset.longitude = geolocation.longitude;
    geolocationEditor.dataset.latitude = geolocation.latitude;

    let geolocationInput = geolocationEditor.querySelector('.geolocation-editor__input');

    geolocationInput.innerText =
        geolocation.longitude.toString().substr(0, 7) + '..;' +
        geolocation.latitude.toString().substr(0, 7) + '..';
};

let subscriber;

module.exports.subscribeOnGeoloactionChanges = function (element) {
    subscriber = element;
};

function setRemoveHandler(element) {
    element.querySelector('.edit-stage__remove-button').addEventListener('click', () => {
        element.parentElement.removeChild(element);

        subscriber.dispatchEvent(new CustomEvent(
            'stageGeolocationChanged',
            {
                detail: {
                    stageId: parseInt(element.dataset.editStageId),
                    removed: true
                }
            }
        ));
    });
}

function setImageSelectHandler(element) {
    var fileInput = element.querySelector('.photo-editor__input');

    fileInput.addEventListener('change', () => {
        var reader = new FileReader();

        if (fileInput.files[0] === undefined) {
            return;
        }

        reader.readAsDataURL(fileInput.files[0]);
        reader.addEventListener('load', () => {
            element.querySelector('.photo-editor__preview').src = reader.result;
        });

        EXIF.getData(fileInput.files[0], function () {
            if (!this.exifdata.GPSLatitude ||
                !this.exifdata.GPSLongitude) {

                return;
            }

            let latitudeArray = this.exifdata.GPSLatitude;
            let latitude = latitudeArray[0] + latitudeArray[1] / 60 + latitudeArray[2] / 3600;

            let longitudeArray = this.exifdata.GPSLongitude;
            let longitude = longitudeArray[0] + longitudeArray[1] / 60 + longitudeArray[2] / 3600;

            let geoloaction = {
                latitude: latitude,
                longitude: longitude
            };

            subscriber.dispatchEvent(new CustomEvent(
                'stageGeolocationChanged',
                {
                    detail: {
                        stageId: parseInt(element.dataset.editStageId),
                        geolocation: geoloaction
                    }
                }
            ));

            module.exports.setGeolocation(element, geoloaction);
        });
    });
}

function setGeolocationHandler(element) {
    var geolocationButton = element.querySelector('.geolocation-editor__input');

    geolocationButton.addEventListener('click', () => {
        mapFunctions.showMap(parseInt(element.dataset.editStageId));
    });
}
