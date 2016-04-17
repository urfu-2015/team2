const express = require('express');
const router = express.Router();
const fs = require('fs');

// const photos = require('./controllers/photos');
//
// router.post('/upload', photos.uploadPhoto);

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './media/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'duzgm6fug',
    api_key: '146231565855942',
    api_secret: 'Apvqh2ydlAyVp72wU4V2DiIEZa8'
});

router.post('/upload', upload.single('photo'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function (result) {
        console.log('Uploaded to ' + result.url);
    });
    fs.unlink(req.file.path);
    res.sendStatus(200);
});

module.exports = router;
