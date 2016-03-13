'use strict';

const express = require('express');
const url = require('url');
const app = express();

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const hbs = require('hbs');
const morgan = require('morgan');

const viewsDir = path.join(__dirname, 'bundles');
const publicDir = path.join(__dirname, 'public');

var passport = require('passport');


// This is the file we created in step 2.
// This will configure Passport to use Auth0
var strategy = require('./middlewares/setup-passport');

// Session and cookies middlewares to keep user logged in
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
// See express session docs for information on the options: https://github.com/expressjs/session
app.use(session({secret: 'YOUR_SECRET_HERE', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', viewsDir);
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(express.static(publicDir));

hbs.registerPartials(path.join(__dirname, 'blocks'));

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

app.listen(app.get('port'),
    () => console.log(`Listening on port ${app.get('port')}`));

module.exports = app;

