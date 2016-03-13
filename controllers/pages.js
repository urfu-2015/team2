exports.index = (req, res) => {
    const data = {
        message: 'Hello, World'
    };
    res.render('main/main', data);
};

exports.error404 = (req, res) => res.sendStatus(404);