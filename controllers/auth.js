exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.login = (req, res) => {
    if (!req.user) {
        throw new Error('user null');
    }
    res.redirect('/quests');
};
