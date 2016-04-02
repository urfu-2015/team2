'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsMarkedSchema = new Schema({
    userId: { type: Number, ref: 'User' },
    questId: { type: Number, ref: 'Quests' }
});

questsMarkedSchema.methods.getQuestsMarked = cb => {
    questsMarkedSchema.find({ userId: this._id }, (err, quests) => {
        cb(err, quests);
    });
};

module.exports = mongoose.model('QuestsMarked', questsMarkedSchema);
