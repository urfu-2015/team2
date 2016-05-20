'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Likes = require('./stagesLikes');
const Comments = require('./stagesComments');

let stageSchema = new Schema({
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    geolocation: { latitude: Number, longitude: Number },
    photo: String,
    description: String,
    order: Number,
    likesCount: Number,
    commentsCount: Number,
    dislikesCount: Number
});

stageSchema.methods.findStageLikes = function (cb) {
    return Likes.find({ stageId: this._id }, (err, likes) => {
        if (err) {
            console.error(err);
        } else {
            cb(likes);
        }
    });
};

stageSchema.methods.findStageComments = function (cb) {
    return Comments.find({ stageId: this._id }, (err, comments) => {
        if (err) {
            console.error(err);
        } else {
            cb(comments);
        }
    });
};

module.exports = mongoose.model('Stages', stageSchema);
