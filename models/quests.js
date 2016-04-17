'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsSchema = new Schema({
    name: String,
    city: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'QuestsLikes' }],
    likesCount: Number,
    dislikesCount: Number,
    comments: [{ type: Schema.Types.ObjectId, ref: 'QuestsComments' }],
    stages: [{ type: Schema.Types.ObjectId, ref: 'Stages' }]
});

module.exports = mongoose.model('Quests', questsSchema);
