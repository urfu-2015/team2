const express = require('express');
const router = express.Router();

const user = require('./controllers/user');

router.post('/', user.createUser);

router.get('/:id', user.getUser);

router.get('/:id/:qType(Started|Done)', user.getUserQuests);

module.exports = router;
