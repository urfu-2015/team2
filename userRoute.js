const express = require('express');
const router = express.Router();

const user = require('./controllers/user');

router.get('/', user.getUser);
router.post('/add', user.createUser);

router.get('/:id', user.getUser);
router.put('/:id', user.updateUser);

router.get('/:id/qStarted', user.getUsersQStarted);
router.get('/:id/qMarked', user.getUsersQMarked);
router.get('/:id/qDone', user.getUsersQDone);

module.exports = router;
