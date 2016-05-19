const express = require('express');
const router = express.Router();

const stages = require('./controllers/stages');

router.post('/', stages.createStage);
router.post('/checkins', stages.registerCheckin);

module.exports = router;
