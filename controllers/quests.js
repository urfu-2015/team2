'use strict';

const Quest = require('../models/quests');
const QuestStatus = require('../models/questsStatus');

exports.createQuest = (req, res) => {
    const data = {
        name: req.body.name,
        city: req.body.city,
        author: req.body.userId,
        description: req.body.description,
        likesCount: 0,
        dislikesCount: 0
    };

    const newQuest = new Quest(data);
    newQuest.save(err => {
        if (err) {
            console.error('Error on quest save: ' + err);
        } else {
            res.json(data);
        }
    });
};

exports.getQuests = (req, res) => {
    let query = req.params.id ? { _id: req.params.id } : {};
    Quest.findQuests(query, quests => res.json(quests));
};

exports.createStatus = (req, res) => {
    const data = {
        questId: req.params.id,
        userId: req.body.userId,
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
};
