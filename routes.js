'use strict';

const pages = require('./controllers/pages');
const passport = require('passport');

module.exports = function (app) {
    app.get('/', pages.index);
    app.get('/login',
        passport.authenticate('auth0', { failureRedirect: '/' }),
        function (req, res) {
            if (!req.user) {
                throw new Error('user null');
            }
            res.redirect('/quests');
        });
    app.get('/quests', pages.quests);
    app.get('/logout', pages.logout);
    app.all('*', pages.error404);
};
