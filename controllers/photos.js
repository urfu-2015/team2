// Пока что не используется (технический долг)
'use strict';

const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'duzgm6fug',
    api_key: '146231565855942',
    api_secret: 'Apvqh2ydlAyVp72wU4V2DiIEZa8'
});

exports.uploadPhoto = (req, res) => {
    cloudinary.uploader.upload(req.body.data, function (result) {
        console.log(result);
    });
    res.sendStatus(200);
};
