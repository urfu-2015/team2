'use strict';

const pages = require('./controllers/pages');
const auth = require('./controllers/auth');
const passport = require('passport');

const userRoute = require('./userRoute');
const questsRoute = require('./questsRoute');

module.exports = function (app) {
    app.get('/', pages.index);

    app.get('/new-quest', pages.newQuest);

    app.get('/edit-quest/:id', pages.editQuest);

    app.use('/user', userRoute);

    app.use('/quests', questsRoute);

    app.get('/login',
        passport.authenticate('auth0', { failureRedirect: '/' }),
        auth.login);
    app.get('/logout', auth.logout);

    app.all('*', pages.error404);
};
