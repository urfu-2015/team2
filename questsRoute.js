const express = require('express');
const router = express.Router();

const pagesController = require('./controllers/pages');
const quests = require('./controllers/quests');
const comments = require('./controllers/comments');

router.get('/', pagesController.quests);
router.post('/', quests.createQuest);
router.post('/start', quests.startQuest);
router.post('/done', quests.doneQuest);

router.get('/:id', quests.getQuestPageInfo);
router.patch('/:id', quests.updateQuest);
router.delete('/:id', quests.deleteQuest);

router.put('/:id', comments.getComments);
router.post('/:id', comments.createComment);
router.post('/:id/:qType(Started|Done|Marked)', quests.createStatus);

module.exports = router;
