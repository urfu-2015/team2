const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const settings = require('../settings.js');
const clientSecret = process.env.AUTH0_CLIENTSECRET;
console.log(settings);
const clientID = settings.auth_clientID;

const strategy = new Auth0Strategy({
    domain: 'yahackathonteam2.auth0.com',
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
