'use strict';

require('./map.css');

const CHOSEN_STAGE_ICON = 'islands#redIcon';
const REGULAR_STAGE_ICON = 'islands#violetIcon';

let map;
let placeMarks = {};
let stageNumber;
let subscriber;
let functionsAfterInit = [];

export const subscribeOnGeoloactionChanges = (element) => {
    subscriber = element;
};

export const showMap = (_stage) => {
    stageNumber = _stage;
    if (map) {
        openMap();
        return;
    }
    initMap();
};

export const addStage = (_stage, geolocation) => {
    if (map) {
        addStageToMap(_stage, geolocation);

        return;
    }

    functionsAfterInit.push(() => {
        addStageToMap(_stage, geolocation);
    });
};

const addStageToMap = (_stage, geolocation) => {
    stageNumber = _stage;

    if (placeMarks.hasOwnProperty(stageNumber)) {
        map.geoObjects.remove(placeMarks[stageNumber]);
    }

    const newPlaceMark = createPlaceMark(
        [geolocation.latitude, geolocation.longitude]
    );

    map.geoObjects.add(newPlaceMark);
    placeMarks[stageNumber] = newPlaceMark;

    subscriber.dispatchEvent(new CustomEvent(
        'geolocationChanged',
        {
            detail: {
                stageId: stageNumber,
                geolocation: {
                    longitude: geolocation.longitude,
                    latitude: geolocation.latitude
                }
            }
        }
    ));
};

export const removeStage = (_stage) => {
    stageNumber = _stage;
    map.geoObjects.remove(placeMarks[stageNumber]);
    delete placeMarks[stageNumber];
};

export const initMap = () => {
    ymaps.ready(() => {
        map = new ymaps.Map('map', {
            center: [$.cookie('userLatitude'), $.cookie('userLongitude')],
            zoom: 12
        });

        map.events.add('click', (e) => {
            const coords = e.get('coords');

            if (placeMarks.hasOwnProperty(stageNumber)) {
                map.geoObjects.remove(placeMarks[stageNumber]);
            }

            const newPlaceMark = createPlaceMark(coords);

            map.geoObjects.add(newPlaceMark);
            placeMarks[stageNumber] = newPlaceMark;

            subscriber.dispatchEvent(new CustomEvent(
                'geolocationChanged',
                {
                    detail: {
                        stageId: stageNumber,
                        geolocation: {
                            latitude: coords[0],
                            longitude: coords[1]
                        }
                    }
                }
            ));
        });

        functionsAfterInit.forEach((func) => func());
    });
};

const createPlaceMark = (coords) =>
    new ymaps.Placemark(coords,
        {
            iconContent: stageNumber + 1
        },
        {
            preset: CHOSEN_STAGE_ICON,
            draggable: true
        }
    );

const openMap = () => {
    Object.keys(placeMarks).forEach((key) => {
        placeMarks[key].options.set('preset', REGULAR_STAGE_ICON);
    });

    if (!placeMarks[stageNumber]) {
        if (!navigator.geolocation) {
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 1000
        };

        navigator.geolocation.getCurrentPosition(
            (position) => map.setCenter([position.coords.latitude, position.coords.longitude], 17),
            null,
            options
        );

        return;
    }

    map.setCenter(placeMarks[stageNumber].geometry.getCoordinates(), 17);
    placeMarks[stageNumber].options.set('preset', CHOSEN_STAGE_ICON);
};

export const getGeoLocations = () => {
    const res = {};

    Object.keys(placeMarks).forEach((key) => {
        res[key] = {
            latitude: placeMarks[key].geometry.getCoordinates()[0],
            longitude: placeMarks[key].geometry.getCoordinates()[1]
        };
    });
    return res;
};
