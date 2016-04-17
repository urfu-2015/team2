const express = require('express');
const router = express.Router();

const user = require('./controllers/user');

router.post('/', user.createUser);

router.get('/:id', user.getUser);
router.put('/:id', user.updateUser);

router.get('/:id/:qType(qStarted|qDone|qMarked)', user.getUserQuests);

module.exports = router;
