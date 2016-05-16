'use strict';

const cloudinary = require('cloudinary');

exports.uploadPhoto = (req, data) => cloudinary.uploader.upload(data);
