'use strict';

const pages = require('./controllers/pages');
const auth = require('./controllers/auth');
const passport = require('passport');
const userRoute = require('./userRoute');
const questsRoute = require('./questsRoute');
const photosRoute = require('./photosRoute');

module.exports = function (app) {
    app.get('/', pages.index);

    app.use('/user', userRoute);

    app.use('/quests', questsRoute);

    app.use('/photos', photosRoute);

    app.get('/login',
        passport.authenticate('auth0', { failureRedirect: '/' }),
        auth.login);
    app.get('/logout', auth.logout);

    app.all('*', pages.error404);
};
