'use strict';

const cloudinary = require('cloudinary');
const Promise = require('bluebird');

exports.uploadPhoto = (req, data) => {
    if (!req.user) {
        return Promise.reject();
    }

    return cloudinary.uploader.upload(data);
};
