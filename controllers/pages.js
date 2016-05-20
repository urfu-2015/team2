'use strict';

const Promise = require('bluebird');
const fs = require('fs');
const layouts = require('handlebars-layouts');
const questController = require('../controllers/quests');
const Quest = require('../models/quests');
const mongoose = require('mongoose');
const User = require('../models/user');

const handlebars = require('hbs').handlebars;
handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('base', fs.readFileSync('./bundles/base.hbs', 'utf8'));

exports.quests = (req, res) => {
    Quest.getFindQuestPromise({})
        .then(quests => {
            var promiseQuests = quests.map(function (questDoc) {
                let quest = questDoc.toObject();
                let data = {
                    doneCount: quest.doneCount,
                    likesCount: quest.likesCount,
                    photo: quest.photo,
                    description: quest.description,
                    name: quest.name,
                    id: quest._id
                };
                return User.findOne({ _id: quest.author }).exec()
                    .then(userDoc => {
                        if (!userDoc) {
                            data.authorName = 'Anonymous';
                        } else {
                            let user = userDoc.toObject();
                            data.authorName = user.login;
                        }
                        return data;
                    });
            });
            return Promise.all(promiseQuests);
        })
        .then(result => {
            let data = {};
            data.quests = result.reverse();
            res.render('quests/quests', Object.assign(data, req.commonData));
        })
        .catch(err => {
            console.log(err);
            req.commonData.errors.push({
                text: 'Some errors with getting quest'
            });
            res.redirect('/');
        });

};

exports.index = (req, res) => {
    const template = handlebars.compile(fs.readFileSync('./bundles/main/main.hbs', 'utf8'));
    const data = {
        currentCity: 'Екатеринбург'
    };
    res.send(template(Object.assign(data, req.commonData)));
};

exports.error404 = (req, res) => res.sendStatus(404);

const checkLoggedIn = (req) => {
    if (!req.user) {
        req.commonData.errors.push({
            text: 'You are not logged in'
        });
    }
};
