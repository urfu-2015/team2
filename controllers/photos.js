// Пока что не используется (технический долг)
'use strict';

const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'duzgm6fug',
    api_key: '146231565855942',
    api_secret: 'Apvqh2ydlAyVp72wU4V2DiIEZa8'
});

exports.uploadPhoto = (req, res) => {
    let data = req.body.data;
    if (!req.user) {
        req.commonData.errors.push({ text: 'Не авторизованные пользователи не могут добавлять фотографии.' });
        res.send(401);
    }
    cloudinary.uploader.upload(data)
        .then(result => {
            // Тут можно записывать result.url в stages.photo
            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
};
