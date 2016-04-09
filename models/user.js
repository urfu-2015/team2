'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestsStarted = require('./questsStarted');
const QuestsDone = require('./questsDone');
const QuestsMarked = require('./questsMarked');

let userSchema = new Schema({
    _id: Number,
    login: String,
    avatar: String,
    qStarted: [{ type: Schema.Types.ObjectId, ref: 'QuestsStarted' }],
    qMarked: [{ type: Schema.Types.ObjectId, ref: 'QuestsMarked' }],
    qDone: [{ type: Schema.Types.ObjectId, ref: 'QuestsDone' }]
});

module.exports = mongoose.model('Users', userSchema);
