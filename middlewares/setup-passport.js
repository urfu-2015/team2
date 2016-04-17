const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('config');
const fs = require('fs');
const clientSecret = process.env.AUTH0_CLIENTSECRET ||
    fs.readFileSync('./config/auth.txt', 'utf-8').match(/=(.*)/)[1];
const clientID = config.get('auth.client_ID');
const authDomain = config.get('auth.domain');

const strategy = new Auth0Strategy({
    domain: authDomain,
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: '/login'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
});

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = strategy;
