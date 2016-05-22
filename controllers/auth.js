const pages = require('./pages.js');
const argv = require('minimist')(process.argv.slice(2));

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.login = (req, res) => {
    if (argv.NODE_ENV === 'development') {
        res.redirect('/');
    } else {
        res.redirect('https://yahackteam2.herokuapp.com/');
    }
};
