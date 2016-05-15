'use strict';

require('./map.css');

const CHOSEN_STAGE_ICON = 'islands#redIcon';
const REGULAR_STAGE_ICON = 'islands#violetIcon';

let map;
let placeMarks = {};
let stageNumber;

export const showMap = (_stage) => {
    stageNumber = _stage;
    if (map) {
        openMap();
        return;
    }
    ymaps.ready(initMap);
};

export const removeStage = (_stage) => {
    stageNumber = _stage;
    map.geoObjects.remove(placeMarks[stageNumber]);
    delete placeMarks[stageNumber];
};

const initMap = () => {
    map = new ymaps.Map('map', {
        center: [$.cookie('userLatitude'), $.cookie('userLongitude')],
        zoom: 12
    });
    map.events.add('click', (e) => {
        const coords = e.get('coords');

        if (!placeMarks.hasOwnProperty(stageNumber)) {
            const newPlaceMark = createPlaceMark(coords);

            map.geoObjects.add(newPlaceMark);
            placeMarks[stageNumber] = newPlaceMark;
        }
    });
};

const createPlaceMark = (coords) =>
    new ymaps.Placemark(coords,
        {
            iconContent: stageNumber + 1
        },
        {
            preset: REGULAR_STAGE_ICON,
            draggable: true
        }
    );

const openMap = () => {
    Object.keys(placeMarks).forEach((key) => {
        placeMarks[key].options.set('preset', REGULAR_STAGE_ICON);
    });

    if (!placeMarks[stageNumber]) {
        return;
    }
    placeMarks[stageNumber].options.set('preset', CHOSEN_STAGE_ICON);
};

const getGeoLocations = () => {
    const res = {};

    Object.keys(placeMarks).forEach((key) => {
        res[key] = {
            latitude: placeMarks[key].geometry.getCoordinates()[0],
            longitude: placeMarks[key].geometry.getCoordinates()[0]
        };
    });
    return res;
};
