const express = require('express');
const router = express.Router();

const quests = require('./controllers/quests');

router.get('/quests', quests.sendQuests);

module.exports = router;
