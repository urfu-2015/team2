'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsStatusSchema = new Schema({
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: String
});

module.exports = mongoose.model('QuestsStatus', questsStatusSchema);
