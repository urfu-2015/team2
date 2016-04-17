'use strict';

const Quest = require('../models/quests');
const QuestStatus = require('../models/questsStatus');
const User = require('../models/user');

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
    let query = {};
    Quest.findQuests(query, quests => res.json(quests));
};

exports.createStatus = (req, res) => {
    const data = {
        questId: req.body.questId,
        userId: req.body.userId,
        status: req.body.status
    };

    const newQuestStatus = new QuestStatus(data);
    newQuestStatus.save(err => {
        if (err) {
            console.error('Error on status quest save: ' + err);
        } else {
            let query = { _id: req.body.userId };
            User.findUser(query, users => {
                let user = users.pop();
                user.quests.push(newQuestStatus);
                user.save(err => {
                    if (err) {
                        console.error('Error on status quest push: ' + err);
                    } else {
                        res.json(data);
                    }
                });
            });
        }
    });
};
