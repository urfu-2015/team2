'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsDoneSchema = new Schema({
    userId: { type: Number, ref: 'User' },
    questId: { type: Number, ref: 'Quests' }
});

questsDoneSchema.methods.getQuestsDone = cb => {
    questsDoneSchema.find({ userId: this._id }, (err, quests) => {
        cb(err, quests);
    });
};

module.exports = mongoose.model('QuestsDone' , questsDoneSchema);
