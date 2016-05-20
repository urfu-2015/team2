'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestsStatus = require('./questsStatus');

let userSchema = new Schema({
    socialId: String,
    login: String,
    avatar: String
});

userSchema.statics.findUser = function (query) {
    return this.find(query).exec();
};

userSchema.methods.getUserQuests = function (status) {
    return QuestsStatus.find({ userId: this._id, status: status }).exec();
};

module.exports = mongoose.model('Users', userSchema);
