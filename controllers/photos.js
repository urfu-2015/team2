'use strict';

const cloudinary = require('cloudinary');

exports.uploadPhoto = (req, data) => {
    return cloudinary.uploader.upload(data);
};
