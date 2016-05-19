'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let stagesCommentsSchema = new Schema({
    stageId: { type: Schema.Types.ObjectId, ref: 'Stages' },
    text: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('StagesComments', stagesCommentsSchema);
