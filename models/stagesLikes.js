'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let stagesLikesSchema = new Schema({
    stageId: { type: Schema.Types.ObjectId, ref: 'Stages' },
    type: Boolean, // true - like, false - dislike
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('StagesLikes', stagesLikesSchema);
