const express = require('express');
const router = express.Router();

const quests = require('./controllers/quests');

router.get('/', quests.getQuests);
router.post('/', quests.createQuest);

router.get('/:id', quests.getQuests);
router.post('/:id/:qType(Started|Done|Marked)', quests.createStatus);

module.exports = router;
