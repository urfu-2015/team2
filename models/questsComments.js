'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsCommentsSchema = new Schema({
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    text: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('QuestsComments', questsCommentsSchema);
