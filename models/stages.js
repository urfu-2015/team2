'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Likes = require('./stagesLikes');
const Comments = require('./stagesComments');
const Checkins = require('./checkins');

let stageSchema = new Schema({
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    geolocation: { latitude: Number, longitude: Number },
    photo: String,
    name: String,
    description: String,
    order: Number,
    likesCount: Number,
    commentsCount: Number,
    dislikesCount: Number
});

stageSchema.statics.deleteStage = function (query) {
    return this.findOne(query).then(stage => stage.remove());
};

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

stageSchema.pre('remove', function (next) {
    let query = { stageId: this._id };

    Likes.remove(query).exec();
    Comments.remove(query).exec();
    Checkins.remove(query).exec();

    next();
});

module.exports = mongoose.model('Stages', stageSchema);
