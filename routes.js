'use strict';

const pages = require('./controllers/pages');
const search = require('./controllers/search');
const auth = require('./controllers/auth');
const passport = require('passport');

const userRoute = require('./userRoute');
const questsRoute = require('./questsRoute');
const stagesRoute = require('./stagesRoute');
const apiRoute = require('./apiRoute');

module.exports = function (app) {
    app.get('/', pages.index);

    app.get('/new-quest', pages.newQuest);

    app.get('/edit-quest/:id', pages.editQuest);

    app.get('/search', search.searchByQuery);

    app.use('/user', userRoute);

    app.use('/quests', questsRoute);

    app.use('/stages', stagesRoute);

    app.use('/api', apiRoute);

    app.get('/login',
        passport.authenticate('auth0', { failureRedirect: '/' }),
        auth.login);
    app.get('/logout', auth.logout);

    app.all('*', pages.error404);
};
