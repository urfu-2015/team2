'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsLikesSchema = new Schema({
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    type: Boolean, // true - like, false - dislike
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('QuestsLikes', questsLikesSchema);
