'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let checkinsSchema = new Schema({
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    stageId: { type: Schema.Types.ObjectId, ref: 'Stages' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('checkins', checkinsSchema);
