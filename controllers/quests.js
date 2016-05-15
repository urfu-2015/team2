'use strict';

const Quest = require('../models/quests');
const QuestStatus = require('../models/questsStatus');
const Stage = require('../models/stages');
const User = require('../models/user');
const layouts = require('handlebars-layouts');
const fs = require('fs');
const photoController = require('./photos.js');
const stageController = require('./stages.js');

const Checkin = require('../models/checkins');
const Promise = require('bluebird');

const handlebars = require('hbs').handlebars;
handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('base', fs.readFileSync('./bundles/base.hbs', 'utf8'));
const mongoose = require('mongoose');
mongoose.Promise = Promise;

function createQuest(req, res) {
    if (!req.body.quest.file) {
        req.commonData.errors.push({ text: 'Не была добавлена фотография квеста.' });
        res.send(403);
        return;
    }

    photoController.uploadPhoto(req, req.body.quest.file)
        .then(result => {
            if (!result) {
                req.commonData.errors.push({
                    text: 'Внутренняя ошибка сервиса, попробуйте еще раз.'
                });
                res.send(500);
                return Promise.reject();
            }

            return Promise.resolve({
                name: req.body.quest.name,
                city: req.body.quest.city,
                author: mongoose.Types.ObjectId(req.commonData.user.mongo_id),
                photo: result.url,
                description: req.body.quest.description,
                likesCount: 0,
                dislikesCount: 0,
                doneCount: 0
            });
        })
        .then(data => {
            let quest = new Quest(data);

            return Promise.promisify(quest.save, { context: quest })();
        })
        .then(quest => {
            let stagePromises = req.body.quest.stages.map(stageItem => {
                stageController.createStage(req, stageItem, quest.id);
            });
            return Promise.all(stagePromises);
        })
        .then(relust => {
            res.send(200);
        })
        .catch(err => {
            req.commonData.errors.push({
                text: 'Не авторизованные пользователи не могут добавлять фотографии.'
            });
            console.log(err);
            res.send(401);
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
            return User.findOne({ _id: quest.author }).exec()
                .then(function (user) {
                    result.push(user);
                    return result;
                });
        })
        .then(result => {
            let quest = result[0];
            let stages = result[1];
            let user = result[2];
            if (!req.commonData.user) {
                result.push('');
                return result;
            }
            return QuestStatus.findOne({
                questId: quest._id,
                userId: req.commonData.user.mongo_id
            }).exec()
                .then(statusDoc => {
                    if (!statusDoc) {
                        result.push('');
                        return result;
                    }
                    let status = statusDoc.toObject();
                    result.push(status.status);
                    return result;
                });
        })
        .then(function (result) {
            let quest = result[0];
            let stages = result[1];
            let user = result[2] || 'Anonymous';
            let statusString = result[3];
            let started = statusString === 'Started';

            var promiseStages = stages.map(function (stage) {
                if (!req.commonData.user) {
                    let objStage = stage.toObject();
                    objStage.done = false;
                    return objStage;
                }
                return Checkin.findOne({
                    stageId: stage._id,
                    userId: req.commonData.user.mongo_id
                }).exec()
                    .then(checkin => {
                        let objStage = stage.toObject();
                        if (checkin) {
                            objStage.done = true;
                        } else {
                            objStage.done = false;
                        }
                        return objStage;
                    });
            });

            return Promise.all([quest, user, started, ...promiseStages]);

        }).spread((quest, user, started, ...stages) => {
            if (!quest) {
                res.sendStatus(404);
            } else {
                if (user) {
                    quest.authorName = user.login;
                }
                res.render(
                    'quest_page/quest_page',
                    Object.assign({
                        quest: quest, started: started, stages: stages
                    }, req.commonData)
                );
            }
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

function startQuest(req, res) {
    if (!req.commonData.user) {
        req.commonData.errors.push({ text: 'Не авторизован.' });
        res.sendStatus(401);
        return;
    }

    let data = {
        questId: req.body.questId,
        userId: req.commonData.user.mongo_id
    };

    QuestStatus.findOne({
        questId: req.body.questId,
        userId: req.commonData.user.mongo_id
    }, function (err, doc) {
        if (doc) {
            req.commonData.errors.push({ text: 'Квест уже начат' });
            res.sendStatus(400);
            return;
        }
        data.status = 'Started';
        new QuestStatus(data).save(err => {
            if (err) {
                req.commonData.errors.push({ text: 'Ошибка при старте квеста' });
                res.sendStatus(500);
            } else {
                res.json(data);
            }
        });
    });
}

module.exports = {
    createQuest,
    getQuests,
    getQuestPageInfo,
    createStatus,
    startQuest
};
