'use strict';
const express = require('express');
const fs = require('fs');
const Promise = require('bluebird');

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'duzgm6fug',
    api_key: '146231565855942',
    api_secret: 'Apvqh2ydlAyVp72wU4V2DiIEZa8'
});

const uploadImage = req => {
    if (!req.user) {
        fs.unlink(req.file.path);
        return Promise.reject();
    }
    return cloudinary.uploader.upload(req.file.path)
        .then(result => {
            console.log('Uploaded to ' + result.url);
            fs.unlink(req.file.path);
            return result;
        })
        .catch(err => {
            console.log(err);
        });
};

exports.createStage = (req, res) => {
    if (!req.file) {
        req.commonData.errors.push({ text: 'Не была добавлена фотография этапа.' });
        res.send(403);
        return;
    }
    uploadImage(req)
        .then(result => {
            if (result) {
                let data = {
                    name: req.body.name,
                    description: req.body.description,
                    latitude: req.body.latitude,
                    longtitude: req.body.longtitude,
                    hint: req.body.hint,
                    order: req.body.order,
                    photo: result.url
                };
                data = JSON.stringify(data);
                res.send(200, data);
            } else {
                req.commonData.errors.push({
                    text: 'Внутренняя ошибка сервиса, попробуйте еще раз.'
                });
                res.send(500);
            }
        })
        .catch(err => {
            req.commonData.errors.push({
                text: 'Не авторизованные пользователи не могут добавлять фотографии.'
            });
            res.send(401);
        });
};
