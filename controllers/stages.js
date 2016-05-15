'use strict';

const fs = require('fs');
const photoController = require('./photos.js');
const Stage = require('../models/stages');
const mongoose = require('mongoose');

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
