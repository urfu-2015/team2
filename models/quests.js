'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Stages = require('./stages');
const Likes = require('./questsLikes');
const Comments = require('./questsComments');

let questsSchema = new Schema({
    name: String,
    city: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
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

module.exports = mongoose.model('Quests', questsSchema);
