const express = require('express');
const router = express.Router();
const pagesController = require('./controllers/pages');

const quests = require('./controllers/quests');

router.get('/', pagesController.quests);
router.post('/', quests.createQuest);
router.post('/start', quests.startQuest);

router.get('/:id', quests.getQuestPageInfo);
router.post('/:id/:qType(Started|Done|Marked)', quests.createStatus);

module.exports = router;
