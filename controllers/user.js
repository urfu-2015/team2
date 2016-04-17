'use strict';

const User = require('../models/user');

exports.createUser = (req, res) => {
    const data = {
        login: req.body.login,
        avatar: req.body.avatar
    };

    const newUser = new User(data);
    newUser.save(err => {
        if (err) {
            console.error('Error on user save: ' + err);
        } else {
            res.json(data);
        }
    });
};

exports.getUser = (req, res) => {
    if (!req.params.id) {
        res.send('Wrong arguments');
    }
    let query = { _id: req.params.id };
    User.findUser(query, users => res.json(users));
};

exports.getUserQuests = (req, res) => {
    let query = { _id: req.params.id };
    User.findUser(query, users => {
        let user = users.pop();
        query.field = req.params.qType;
        user.populateQuests(query, user => res.json(user));
    });
};
