// Технический долг

const express = require('express');
const router = express.Router();

const photos = require('./controllers/photos');

router.post('/upload', photos.uploadPhoto);

module.exports = router;
