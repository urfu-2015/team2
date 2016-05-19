require('./stageEditor.css');
const mapFunctions = require('../map/map.js');

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

function setRemoveHandler(element) {
    element.querySelector('.edit-stage__remove-button').addEventListener('click',
        () => element.parentElement.removeChild(element)
    );
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
    });
}

function setGeolocationHandler(element) {
    var geolocationButton = element.querySelector('.geolocation-editor__input');

    geolocationButton.addEventListener('click', () => {
        mapFunctions.showMap(parseInt(element.dataset.editStageId));
    });
}
