'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let likesSchema = new Schema({
    collectionName: String,
    objectId: Number,
    type: Boolean, // true - like, false - dislike
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Likes', likesSchema);
