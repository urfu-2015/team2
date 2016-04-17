const express = require('express');
const router = express.Router();

const quests = require('./controllers/quests');

router.get('/', quests.getQuests);
router.post('/', quests.createQuest);

router.post('/status', quests.createStatus);

module.exports = router;
