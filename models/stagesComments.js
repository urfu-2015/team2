'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let stagesCommentsSchema = new Schema({
    stageId: { type: Schema.Types.ObjectId, ref: 'Quests' },
    text: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

stagesCommentsSchema.statics.findComments = function (query, cb) {
    return this.find(query, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            cb(data);
        }
    });
};

module.exports = mongoose.model('StagesComments', stagesCommentsSchema);
