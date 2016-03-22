'use strict';
const Promise = require('bluebird');

const express = require('express');
const url = require('url');
const app = express();

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const hbs = require('hbs');
const registerPartials = Promise.promisify(hbs.registerPartials.bind(hbs));

const morgan = require('morgan');

const passport = require('passport');
const strategy = require('./middlewares/setup-passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const viewsDir = path.join(__dirname, 'bundles');
const publicDir = path.join(__dirname, 'public');

app.use(cookieParser());
app.use(session({ secret: 'YOUR_SECRET_HERE', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', viewsDir);
app.set('view engine', 'hbs');
app.use(morgan('dev'));
app.use(express.static(publicDir));

app.set('port', (process.env.PORT || 8080));

app.use((req, res, next) => {
    req.commonData = {
        meta: {
            description: 'Hahaton',
            charset: 'utf-8'
        },
        page: {
            title: 'PhotoQuest'
        },
        user: req.user,
        host: url.format({
            protocol: req.protocol,
            host: req.get('host')
        }),
        isDev: argv.NODE_ENV === 'development'
    };

    next();
});

require('./routes.js')(app);

module.exports = registerPartials(path.join(__dirname, 'blocks'))
    .then(() => {
        app.listen(app.get('port'),
            () => console.log(`Listening on port ${app.get('port')}`));
        return app;
    })
    .catch(error => {
        console.log('Some error occurred ' + error);
    });

