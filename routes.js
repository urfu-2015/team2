'use strict';

const pages = require('./controllers/pages');
const passport = require('passport');

module.exports = function (app) {
    app.get('/', pages.index);
    app.get('/login',
        passport.authenticate('auth0', { failureRedirect: '/' }),
        pages.login);
    app.get('/quests', pages.quests);
    app.get('/logout', pages.logout);
    app.all('*', pages.error404);
};
