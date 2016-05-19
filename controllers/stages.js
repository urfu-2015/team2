'use strict';

const fs = require('fs');
const photoController = require('./photos.js');
const Stage = require('../models/stages');
const mongoose = require('mongoose');
const Checkin = require('../models/checkins');
const geolib = require('geolib');

exports.createStage = (req, res) => {
    if (!req.body.file) {
        req.commonData.errors.push({ text: 'Не была добавлена фотография этапа.' });
        res.send(403);
        return;
    }
    photoController.uploadPhoto(req, req.body.file)
        .then(result => {
            if (!result) {
                req.commonData.errors.push({
                    text: 'Внутренняя ошибка сервиса, попробуйте еще раз.'
                });
                res.send(500);
                return;
            }

            let data = {
                name: req.body.name,
                description: req.body.description,
                geolocation: {
                    latitude: req.body.latitude,
                    longtitude: req.body.longtitude
                },
                order: req.body.order,
                questId: mongoose.Types.ObjectId(req.body.questId),
                photo: result.url,
                likesCount: 0,
                commentsCount: 0,
                dislikesCount: 0
            };

            new Stage(data).save(err => {
                if (err) {
                    console.error('Error on stage save: ' + err);
                } else {
                    res.json(data);
                }
            });
        })
        .catch(err => {
            req.commonData.errors.push({
                text: 'Не авторизованные пользователи не могут добавлять фотографии.'
            });
            res.send(401);
        });
};

exports.registerCheckin = (req, res) => {
    if (!req.commonData.user) {
        req.commonData.errors.push({ text: 'Не авторизован.' });
        res.send(401);
        return;
    }

    let data = {
        questId: req.body.questId,
        stageId: req.body.stageId,
        userId: req.commonData.user.mongo_id,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    };

    Stage.findOne(
        {
            _id: data.stageId
        },
        function (err, doc) {
            if (err) {
                req.commonData.errors.push({ text: 'Этап не найден в базе данных' });
                res.sendStatus(500);
                return;
            }
            let stage = doc.toObject();
            let pointLatitude = stage.geolocation.latitude;
            let pointLongitude = stage.geolocation.longitude;
            const distance = geolib.getDistance(
                {
                    latitude: data.latitude,
                    longitude: data.longitude
                },
                {
                    latitude: pointLatitude,
                    longitude: pointLongitude
                }
            );

            // distance в метрах
            // if (distance > 20000000) {
            if (distance > 150) {
                data.checkin = false;
                res.json(data);
            } else {
                Checkin.findOne({ stageId: data.stageId }, function (err, doc) {
                    if (err) {
                        req.commonData.errors.push({ text: 'Чекин не найден в базе данных' });
                        res.sendStatus(500);
                        return;
                    }

                    if (doc) {
                        data.checkin = false;
                        res.json(data);
                        return;
                    }

                    new Checkin(data).save(err => {
                        if (err) {
                            req.commonData.errors.push({ text: 'Ошибка при чекине' });
                            res.sendStatus(500);
                        } else {
                            data.checkin = true;
                            res.json(data);
                        }
                    });
                });
            }
        }
    );
};
