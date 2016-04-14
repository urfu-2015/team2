'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestsStarted = require('./questsStarted');

//const Quests = require('./quests');

let userSchema = new Schema({
    _id: Number,
    login: String,
    avatar: String,
    qStarted: [{ type: Schema.Types.ObjectId, ref: 'QuestsStarted' }],
    qMarked: [{ type: Schema.Types.ObjectId, ref: 'Quests' }],
    qDone: [{ type: Schema.Types.ObjectId, ref: 'Quests' }]
});

module.exports = mongoose.model('Users', userSchema);
