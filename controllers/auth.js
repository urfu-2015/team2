const pages = require('./pages.js');

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.login = (req, res) => {
    res.redirect('/');
};
