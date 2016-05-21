'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Stages = require('./stages');
const User = require('./user');
const Likes = require('./questsLikes');
const Comments = require('./questsComments');
const Status = require('./questsStatus');
const Checkins = require('./checkins');

const Promise = require('bluebird');

let questsSchema = new Schema({
    name: String,
    city: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    photo: String,
    description: String,
    likesCount: Number,
    dislikesCount: Number,
    doneCount: Number
});

questsSchema.statics.findQuests = function (query, cb) {
    return this.find(query, (err, quests) => {
        if (err) {
            console.error(err);
        } else {
            cb(quests);
        }
    });
};

questsSchema.statics.getFindQuestPromise = function (query) {
    return this.find(query).exec();
};

questsSchema.statics.deleteQuest = function (query) {
    return this.findOne(query).then(quest => quest.remove());
};

questsSchema.statics.getQuestsData = function (req, query) {
    return this.find(query).exec()
        .then(quests => {
            var promiseQuests = quests.map(questDoc => {
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
        .then(quests => {
            var promiseQuests = quests.map(quest => {
                if (!req.commonData.user) {
                    return quest;
                }
                return QuestStatus.findOne({
                    questId: quest.id,
                    userId: req.commonData.user.mongo_id
                }).exec()
                    .then(statusDoc => {
                        if (!statusDoc) {
                            return quest;
                        }
                        let status = statusDoc.toObject();
                        if (status.status === 'Started') {
                            quest.started = true;
                        }
                        if (status.status === 'Done') {
                            quest.done = true;
                        }
                        return quest;
                    });
            });
            return Promise.all(promiseQuests);
        })
        .then(result => {
            let data = {};

            data.quests = result.reverse();

            if (req.commonData.user) {
                data.addQuestsAllowed = true;
            }

            if (req.query.query) {
                data.query = req.query.query;
            }

            return data;
        });
};

questsSchema.methods.findQuestStages = function () {
    return Stages.find({ questId: this._id }).exec();
};

questsSchema.methods.findQuestLikes = function (cb) {
    return Likes.find({ questId: this._id }, (err, likes) => {
        if (err) {
            console.error(err);
        } else {
            cb(likes);
        }
    });
};

questsSchema.methods.findQuestComments = function (cb) {
    return Comments.find({ questId: this._id }, (err, comments) => {
        if (err) {
            console.error(err);
        } else {
            cb(comments);
        }
    });
};

questsSchema.pre('remove', function (next) {
    let query = { questId: this._id };

    Stages.find(query, (err, stages) => {
        if (!err) {
            stages.forEach((stage) => stage.remove());
        }
    });

    Likes.remove(query).exec();
    Comments.remove(query).exec();
    Status.remove(query).exec();
    Checkins.remove(query).exec();

    next();
});

module.exports = mongoose.model('Quests', questsSchema);
