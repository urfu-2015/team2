'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsStartedSchema = new Schema({
    userId: { type: Number, ref: 'User' },
    questId: { type: Number, ref: 'Quests' }
});

questsStartedSchema.methods.getQuestsStarted = cb => {
    questsStartedSchema.find({ userId: this._id }, (err, quests) => {
        cb(err, quests);
    });
};

module.exports = mongoose.model('QuestsStarted', questsStartedSchema);
