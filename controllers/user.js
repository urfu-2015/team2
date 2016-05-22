'use strict';

const User = require('../models/user');
const Quest = require('../models/quests');
const QuestStatus = require('../models/questsStatus');

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
    let query = { _id: req.params.id };
    User.findUser(query, users => res.json(users));
};

exports.getUserQuests = (req, res) => {
    let data = {};

    if (req.params.qType === 'Started') {
        req.commonData.started = true;
    }
    if (req.params.qType === 'Done') {
        req.commonData.done = true;
    }

    User.findUser({ _id: req.params.id })
        .then(users => {
            let user = users.pop();
            data.shownUser = user;
            return user.getUserQuests(req.params.qType);
        })
        .then(quests => {
            var promiseQuests = quests.map(quest =>
                Quest.findOne({ _id: quest.questId }).exec()
                    .then(currentQuest => {
                        let data = {
                            doneCount: currentQuest.doneCount,
                            likesCount: currentQuest.likesCount,
                            photo: currentQuest.photo,
                            description: currentQuest.description,
                            name: currentQuest.name,
                            id: currentQuest._id
                        };
                        return User.findOne({ _id: currentQuest.author }).exec()
                            .then(userDoc => {
                                if (!userDoc) {
                                    data.authorName = 'Anonymous';
                                } else {
                                    let user = userDoc.toObject();
                                    data.authorName = user.login;
                                }
                                return data;
                            });
                    })
            );
            return Promise.all(promiseQuests);
        })
        .then(quests => {
            if (!req.commonData.user) {
                return quests;
            }

            var promiseQuests = quests.map(quest => QuestStatus.count(
                    {
                        questId: quest.id,
                        userId: req.commonData.user.mongo_id,
                        status: req.params.qType
                    }
                ).exec()
                    .then(count => {
                        if (count > 0) {
                            if (req.params.qType === 'Started') {
                                quest.started = true;
                            }
                            if (req.params.qType === 'Done') {
                                quest.done = true;
                            }
                        }
                        return quest;
                    })
            );
            return Promise.all(promiseQuests);
        })
        .then(quests => {
            data.quests = quests;

            res.render('profile/profile', Object.assign(data, req.commonData));
        })
        .catch(err => {
            console.log(err);
            req.commonData.errors.push({
                text: 'Some errors with getting quest'
            });
            res.redirect('/');
        });
};

exports.getCreatedQuests = (req, res) => {
    req.commonData.created = true;

    Quest.getQuestsData(req, { author: req.params.id })
        .then((data) => User.findUser({ _id: req.params.id })
                .then(users => {
                    let user = users.pop();
                    data.shownUser = user;
                    return data;
                })
        )
        .then(data => {
            res.render('profile/profile', Object.assign(data, req.commonData));
        })
        .catch(err => {
            console.log(err);
            req.commonData.errors.push({
                text: 'Some errors with getting quest'
            });
            res.redirect('/');
        });
};
