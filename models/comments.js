'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentsSchema = new Schema({
    collectionName: String,
    objectId: Number,
    text: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Comments', commentsSchema);
