'use strict';

const User = require('../models/user');
const mongoose = require('mongoose');

mongoose.connect('mongodb://<login>:<password>@ds011439.mlab.com:11439/photoquest');
mongoose.connection.on('error', console.error.bind(console, 'connection error'));

exports.createUser = (req, res) => {
    const data = {
        _id: req.body.id,
        login: req.body.login,
        avatar: req.body.avatar
    };

    const newUser = new User(data);
    newUser.save(err => {
        if (err) {
            console.error('Error on quest save: ' + err);
        } else {
            res.json(data);
        }
    });
};

exports.getUser = (req, res) => {
    let query = req.params.id ? { _id: req.params.id } : {};
    User.find(query, (err, users) => {
        if (err) {
            console.error(err);
        } else {
            res.json(users);
        }
    });
};

exports.getUsersQStarted = (req, res) => {
    User.find({ _id: req.params.id })
        .populate('qStarted')
        .exec((err, users) => {
            if (err) {
                console.error(err);
            } else {
                res.json(users[0].qStarted);
            }
        });
};

exports.getUsersQMarked = (req, res) => {
    User.find({ _id: req.params.id })
        .populate('qMarked')
        .exec((err, users) => {
            if (err) {
                console.error(err);
            } else {
                res.json(users[0].qMarked);
            }
        });
};

exports.getUsersQDone = (req, res) => {
    User.find({ _id: req.params.id })
        .populate('qDone')
        .exec((err, users) => {
            if (err) {
                console.error(err);
            } else {
                res.json(users[0].qDone);
            }
        });
};
