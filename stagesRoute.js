const express = require('express');
const router = express.Router();
const stages = require('./controllers/stages');

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

router.post('/', upload.single('photo'), stages.createStage);

module.exports = router;
