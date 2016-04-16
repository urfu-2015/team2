'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsStartedSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    stageId: [{ type: Schema.Types.ObjectId, ref: 'Stages' }]
});

module.exports = mongoose.model('QuestsStarted', questsStartedSchema);
