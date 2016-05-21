'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questsCommentsSchema = new Schema({
    questId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    text: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

questsCommentsSchema.statics.findComments = function (query, cb) {
    return this.find(query, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            cb(data);
        }
    });
};

module.exports = mongoose.model('QuestsComments', questsCommentsSchema);
