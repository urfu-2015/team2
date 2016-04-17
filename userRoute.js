const express = require('express');
const router = express.Router();

const user = require('./controllers/user');

router.get('/', user.getUser);
router.post('/', user.createUser);

router.get('/:id', user.getUser);

router.get('/:id/:qType(Started|Done|Marked)', user.getUserQuests);

module.exports = router;
