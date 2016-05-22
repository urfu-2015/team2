'use strict';

const Quest = require('../models/quests');
const QuestStatus = require('../models/questsStatus');
const QuestsLikes = require('../models/questsLikes');
const StagesLikes = require('../models/stagesLikes');
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
const createHttpError = require('http-errors');

mongoose.Promise = Promise;

function createQuest(req, res) {
    if (!req.commonData.user) {
        res.status(401).send('Вы не авторизованы');

        return;
    }

    if (req.body.quest.file === '') {
        res.sendStatus(403).send('Картинка квеста не указана');

        return;
    }

    let questId;

    photoController.uploadPhoto(req, req.body.quest.file)
        .then(result => {
            if (!result) {
                return Promise.reject(createHttpError(500, 'Не удалось загрузить фотографию'));
            }

            return new Quest({
                name: req.body.quest.name,
                city: req.body.quest.city,
                author: mongoose.Types.ObjectId(req.commonData.user.mongo_id),
                photo: result.url,
                description: req.body.quest.description,
                likesCount: 0,
                dislikesCount: 0,
                doneCount: 0
            }).save();
        })
        .then(quest => {
            questId = quest.id;

            let stagePromises = req.body.quest.stages.map(
                stageItem => stageController.createStage(req, stageItem, quest.id)
            );

            return Promise.all(stagePromises);
        })
        .then(() => {
            res.send(questId);
        })
        .catch(err => {
            console.log(err);

            if (err.http_code !== undefined) {
                res.status(err.http_code).send(err.message);
            }

            res.status(500).send(err.message);
        });
}

function updateQuest(req, res) {
    if (!req.commonData.user) {
        res.status(401).send('Вы не авторизованы');

        return;
    }

    let photoPromise = req.body.quest.file ?
        photoController.uploadPhoto(req, req.body.quest.file) : Promise.resolve();

    photoPromise
        .then(result => {
            let updatedData = {
                name: req.body.quest.name,
                city: req.body.quest.city,
                description: req.body.quest.description
            };

            if (req.body.quest.file) {
                if (!result) {
                    return Promise.reject(createHttpError(500, 'Не удалось загрузить фотографию'));
                }

                updatedData.photo = result.url;
            }

            return updatedData;
        })
        .then(updatedData => Quest.update({ _id: req.params.id }, updatedData).exec())
        .then(() => {
            let stagePromises = req.body.quest.stages.map(stageItem => {
                if (stageItem.edited) {

                    return stageController.updateStage(req, stageItem);
                }

                if (stageItem.removed) {
                    return stageController.deleteStage(req, stageItem);
                }

                return stageController.createStage(req, stageItem, req.params.id);
            });

            return Promise.all(stagePromises);
        })
        .then(() => {
            res.send(req.params.id);
        })
        .catch(err => {
            console.log(err);

            if (err.http_code !== undefined) {
                res.status(err.http_code).send(err.message);
            }

            res.status(500).send(err.message);
        });
}

function deleteQuest(req, res) {
    if (!req.params.id) {
        res.sendStatus(400);
    }

    let query = {
        _id: req.params.id
    };

    Quest.deleteQuest(query)
        .then(() => res.sendStatus(200));
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
            if (!result[0]) {
                res.sendStatus(404);
                return;
            } else {
                let quest = result[0];
                return User.findOne({ _id: quest.author }).exec()
                    .then(function (user) {
                        result.push(user);
                        return result;
                    });
            }
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
                        objStage.started = started;
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
                    if (req.commonData.user && req.commonData.user.mongo_id === user.id) {
                        quest.editAllowed = true;
                    }
                }

                stages = stages.sort((stage1, stage2) => stage1.order - stage2.order);

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

function getUserLikes(req, res) {
    let user = req.commonData.user;
    if (!user) {
        res.send('not authorized');
        return;
    }
    let questLike = null;
    QuestsLikes
        .findOne({ questId: req.params.id, userId: user.mongo_id })
        .exec()
        .then(like => {
            questLike = like;
        })
        .then(result => Stage.find({ questId: req.params.id }).exec())
        .then(stages => StagesLikes
            .find({ stageId: { $in: stages }, userId: user.mongo_id })
            .exec())
        .then(likes => {
            let stagesLikes = likes;
            res.json({
                questLike: questLike,
                stagesLikes: stagesLikes
            });
        });
}

function getUserQuestLikes(req, res) {
    let user = req.commonData.user;
    if (!user) {
        res.send('not authorized');
        return;
    }
    QuestsLikes
        .find({ userId: user.mongo_id })
        .exec()
        .then(likes => {
            res.json({
                questsLikes: likes
            });
        });
}

function handleLike(req, res) {
    let user = req.commonData.user;
    let questId = req.params.id;
    let stageId = req.body.stageId;
    let type = req.body.type;
    let count = { like: 0, dislike: 0 };
    let likeType;
    if (!user) {
        res.status(401).send('Вы должны авторизоваться, чтобы ставить лайки');
        return;
    }
    var newLikeQuery = { type: type, userId: mongoose.Types.ObjectId(user.mongo_id) };
    var task = {};
    if (stageId) {
        task.LikesCollection = StagesLikes;
        task.Collection = Stage;
        task.idType = 'stageId';
        task.id = stageId;
        task.queryId = { stageId: stageId };
        task.queryObjectId = mongoose.Types.ObjectId(stageId);
        newLikeQuery.stageId = mongoose.Types.ObjectId(stageId);
    } else {
        task.LikesCollection = QuestsLikes;
        task.Collection = Quest;
        task.idType = 'questId';
        task.id = questId;
        task.queryId = { questId: questId };
        task.queryObjectId = mongoose.Types.ObjectId(questId);
        newLikeQuery.questId = mongoose.Types.ObjectId(questId);
    }
    var item;

    task.LikesCollection
        .findOne(Object.assign(task.queryId, { userId: user.mongo_id }))
        .exec()
        .then(like => {
            if (like) {
                if (type === like.type) {
                    count[type ? 'like' : 'dislike'] = -1;
                    return like.remove();
                } else {
                    likeType = type;
                    count[type ? 'like' : 'dislike'] = 1;
                    count[type ? 'dislike' : 'like'] = -1;
                    like.type = type;
                    return like.save();
                }
            }
            count[type ? 'like' : 'dislike'] = 1;
            likeType = type;
            return new task.LikesCollection(newLikeQuery).save();

        })
        .then(like => task.Collection.findOne({ _id: task.id }).exec())
        .then(item => {
            item.likesCount += count.like;
            item.dislikesCount += count.dislike;
            return item.save();
        })
        .then(item => {
            res.json({
                likesCount: item.likesCount,
                dislikesCount: item.dislikesCount,
                type: likeType,
                user: user
            });
        });
}

function handleQuestLike(req, res) {
    let user = req.commonData.user;
    let questId = req.body.questId;
    let count = { like: 0, dislike: 0 };
    if (!user) {
        res.status(401).send('Вы должны авторизоваться, чтобы ставить лайки');
        return;
    }
    let resType;

    // на странице квеста есть только лайк
    // надо проверить, есть ли в базе
    QuestsLikes
        .findOne({ questId: questId, userId: user.mongo_id })
        .exec()
        .then(like => {
            if (like) {

                // лайк это или дизлайк?
                // если лайк, убрать его
                if (like.type) {
                    count.like = -1;
                    resType = false;
                    return like.remove();
                } else {
                    count.like = 1;
                    count.dislike = -1;
                    like.type = true;
                    resType = true;
                    return like.save();
                }
            }

            // если не было в бд, то создаем
            count.like = 1;
            resType = true;
            return new QuestsLikes({
                questId: mongoose.Types.ObjectId(questId),
                userId: mongoose.Types.ObjectId(user.mongo_id),
                type: true
            }).save();
        })
        .then(like => Quest.findOne({ _id: questId }).exec())
        .then(quest => {
            quest.likesCount += count.like;
            quest.dislikesCount += count.dislike;
            return quest.save();
        })
        .then(quest => {
            res.json({
                type: resType,
                likesCount: quest.likesCount,
                user: user
            });
        });
}

function doneQuest(req, res) {
    if (!req.commonData.user) {
        req.commonData.errors.push({ text: 'Не авторизован.' });
        res.sendStatus(401);
        return;
    }

    let query = {
        questId: req.body.questId,
        userId: req.commonData.user.mongo_id
    };

    let eqChecker = {};

    Stage.count({ questId: query.questId }).exec()
        .then(stagesCount => {
            eqChecker.stagesCount = stagesCount;
            return stagesCount;
        })
        .then(() => Checkin.count(query).exec())
        .then(checkinsCount => {
            eqChecker.checkinsCount = checkinsCount;
            return checkinsCount;
        })
        .then(() => {
            if (eqChecker.stagesCount === eqChecker.checkinsCount) {
                return QuestStatus.findOne({
                    questId: query.questId,
                    userId: query.userId
                }).exec();
            }
            return Promise.reject({ questNotDone: true });
        })
        .then(statusDoc => {
            statusDoc.status = 'Done';
            statusDoc.save();
            res.json({ questId: req.body.questId });
        })
        .catch(err => {
            if (err.questNotDone) {
                res.sendStatus(403);
                return;
            }
            req.commonData.errors.push({ text: 'Ошибка при проверке выполнения квеста' });
            res.sendStatus(500);
        });
}

function sendQuests(req, res) {
    let query = { $and: [] };
    let oldDate = req.query.oldDate;

    if (oldDate) {
        query.$and.push({
            createdAt: {
                $lt: new Date(oldDate)
            }
        });
    }

    if (req.query.query) {
        query.$and.push({ name: { $regex: new RegExp(req.query.query, 'i') } });
    }

    if (query.$and.length === 0) {
        query = {};
    }

    Quest.getQuestsData(req, query, parseInt(req.query.count) + 1)
        .then(data => {
            if (data.quests.length === 0) {
                res.json({
                    data: {},
                    oldDate: null,
                    isQuestsOver: true
                });

                return;
            }

            let isQuestsOver = data.quests.length < parseInt(req.query.count) + 1;

            if (data.quests.length > req.query.count) {
                data.quests.pop();
            }

            let oldDate = data.quests[data.quests.length - 1].createdAt;

            res.json({
                data: data,
                oldDate: oldDate,
                isQuestsOver: isQuestsOver
            });
        });
}

module.exports = {
    createQuest,
    updateQuest,
    deleteQuest,
    getQuests,
    getQuestPageInfo,
    createStatus,
    startQuest,
    doneQuest,
    getUserLikes,
    handleLike,
    getUserQuestLikes,
    handleQuestLike,
    sendQuests
};
