'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsDoneSchema = new Schema({
    userId: { type: Number, ref: 'User' },
    questId: { type: Number, ref: 'Quests' }
});

module.exports = mongoose.model('QuestsDone', questsDoneSchema);
