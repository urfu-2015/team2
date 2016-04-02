'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questsStarted = require('./questsStarted');
const questsDone = require('./questsDone');
const questsMarked = require('./questsMarked');

let userSchema = new Schema({
    _id: Number,
    login: String,
    avatar: String
});

userSchema.methods.getQuestsStarted = cb => {
    questsStarted.find({ userId: this._id }, (err, quests) => {
        cb(err, quests);
    });
};

userSchema.methods.getQuestsDone = cb => {
    questsDone.find({ userId: this._id }, (err, quests) => {
        cb(err, quests);
    });
};

userSchema.methods.getQuestsMarked = cb => {
    questsMarked.find({ userId: this._id }, (err, quests) => {
        cb(err, quests);
    });
};

module.exports = mongoose.model('Users', userSchema);
