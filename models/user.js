'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    login: String,
    avatar: String,
    quests: [{ type: Schema.Types.ObjectId, ref: 'QuestsStatus' }]
});

userSchema.statics.findUser = function (query, cb) {
    return this.find(query, (err, users) => {
        if (err) {
            console.error(err);
        } else {
            cb(users);
        }
    });
};

userSchema.methods.getUserQuests = function (params, cb) {
    return this.model('Users').find({ _id: params._id })
        .populate({
            path: 'quests',
            populate: { path: params.field }
        })
        .exec((err, users) => {
            if (err) {
                console.error(err);
            } else {
                cb(users);
            }
        });
};

module.exports = mongoose.model('Users', userSchema);
