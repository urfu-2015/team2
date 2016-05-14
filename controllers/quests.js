'use strict';

const Quest = require('../models/quests');
const QuestStatus = require('../models/questsStatus');
const Stage = require('../models/stages');
const layouts = require('handlebars-layouts');
const fs = require('fs');

const handlebars = require('hbs').handlebars;
const mongoose = require('mongoose');

function createQuest(req, res) {
    const data = {
        name: req.body.name,
        city: req.body.city,
        author: mongoose.Types.ObjectId(req.body.userId),
        photo: req.body.photo,
        description: req.body.description,
        likesCount: 0,
        dislikesCount: 0,
        doneCount: 0
    };

    const newQuest = new Quest(data);
    newQuest.save(err => {
        if (err) {
            console.error('Error on quest save: ' + err);
        } else {
            res.json(data);
        }
    });
}

function getQuests(req, res) {
    let query = req.params.id ? { _id: req.params.id } : {};
    Quest.findQuests(query, quests => res.json(quests));
}

function getQuestPageInfo(req, res) {
    const id = req.params.id;
    let query = { questId: id };
    Quest.findOne({ _id: id }).exec()
        .then(function (quest) {
            return Stage.find(query).exec()
                .then(function (stages) {
                    return [quest, stages];
                });
        })
        .then(function (result) {
            let quest = result[0];
            let stages = result[1];
            const template = handlebars.compile(
                fs.readFileSync('./bundles/quest_page/quest_page.hbs', 'utf8'));
            res.send(template(Object.assign({ quest: quest, stages: stages }, req.commonData)));
        })
        .then(null, function (err) {
            if (err) {
                console.error(err);
                return;
            }
        });
}

function createStatus(req, res) {
    const data = {
        questId: mongoose.Types.ObjectId(req.params.id),
        userId: mongoose.Types.ObjectId(req.body.userId),
        status: req.params.qType
    };

    const newQuestStatus = new QuestStatus(data);
    newQuestStatus.save(err => {
        if (err) {
            console.error('Error on quest status save: ' + err);
        } else {
            res.json(data);
        }
    });
}

module.exports = {
    createQuest,
    getQuests,
    getQuestPageInfo,
    createStatus
};
