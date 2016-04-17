'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let stageSchema = new Schema({
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    geolocation: { latitude: Number, longitude: Number },
    photo: String,
    hint: String,
    order: Number,
    likes: [{ type: Schema.Types.ObjectId, ref: 'StagesLikes' }],
    likesCount: Number,
    dislikesCount: Number,
    comments: [{ type: Schema.Types.ObjectId, ref: 'StagesComments' }]
});

module.exports = mongoose.model('Stages', stageSchema);
