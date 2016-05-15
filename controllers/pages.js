'use strict';

const Promise = require('bluebird');
const fs = require('fs');
const layouts = require('handlebars-layouts');
const questController = require('../controllers/quests');
const Quest = require('../models/quests');
const mongoose = require('mongoose');

const handlebars = require('hbs').handlebars;
handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('base', fs.readFileSync('./bundles/base.hbs', 'utf8'));

exports.quests = (req, res) => {
    const template = handlebars.compile(fs.readFileSync('./bundles/quests/quests.hbs', 'utf8'));
    Quest.getFindQuestPromise('')
        .then(result => {
            let data = {
                quests: []
            };
            console.log(mongoose.Types.ObjectId(result[1].author).login);
            result.forEach(quest => {
                data.quests.push({
                    doneCount: quest.doneCount,
                    likesCount: quest.likesCount,
                    authorName: mongoose.Types.ObjectId(quest.author).login || 'Anonymous',
                    photo: quest.photo,
                    description: quest.description,
                    name: quest.name,
                    id: quest._id
                });
            });
            return data;
        })
        .then(data => {
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
