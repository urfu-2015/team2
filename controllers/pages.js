exports.index = (req, res) => {
    const data = {
        currentCity: 'Екатеринбург',
        loggedIn: false
    };
    res.render('main/main', Object.assign(data, req.commonData));
};

exports.error404 = (req, res) => res.sendStatus(404);
