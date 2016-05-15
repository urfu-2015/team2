const express = require('express');
const router = express.Router();

const stages = require('./controllers/stages');

router.post('/', stages.createStage);

module.exports = router;
