'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestsStatus = require('./questsStatus');

let userSchema = new Schema({
    socialId: String,
    login: String,
    avatar: String
});

userSchema.statics.findUser = function (query, cb) {
    return this.find(query, (err, users) => {
        if (err) {
            console.error(err);
        } else {
            cb(users);
        }
    });
};

userSchema.methods.getUserQuests = function (cb) {
    return QuestsStatus.find({ userId: this._id }, (err, quests) => {
        if (err) {
            console.error(err);
        } else {
            cb(quests);
        }
    });
};

module.exports = mongoose.model('Users', userSchema);
