// Технический долг

const express = require('express');
const router = express.Router();
const fs = require('fs');

const photos = require('./controllers/photos');

router.post('/upload', photos.uploadPhoto);
