'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let stageSchema = new Schema({
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    geolocation: { latitude: Number, longitude: Number },
    photo: String,
    hint: String,
    order: Number,
    likes: [{ type: Schema.Types.ObjectId, ref: 'Likes' }],
    likesCount: Number,
    dislikesCount: Number,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }]
});

module.exports = mongoose.model('Stages', stageSchema);
