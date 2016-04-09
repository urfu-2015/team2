'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let likesSchema = new Schema({
    collection: String,
    objectId: Number,
    type: Boolean, // true - like, false - dislike
    userId: { type: Number, ref: 'User' }
});

module.exports = mongoose.model('Likes', likesSchema);
