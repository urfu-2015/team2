'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestsStarted = require('./questsStarted');

let userSchema = new Schema({
    login: String,
    avatar: String,
    qStarted: [{ type: Schema.Types.ObjectId, ref: 'QuestsStarted' }],
    qMarked: [{ type: Schema.Types.ObjectId, ref: 'Quests' }],
    qDone: [{ type: Schema.Types.ObjectId, ref: 'Quests' }]
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

userSchema.methods.update = function (params, cb) {
    this[params.questType].push(params.id);
    this.save(function (err) {
        if (err) {
            console.error('Error on quest save: ' + err);
        } else {
            cb(this);
        }
    });
};

userSchema.methods.populateField = function (params, cb) {
    return this.model('Users').find({ _id: params._id })
        .populate(params.field)
        .exec((err, users) => {
            if (err) {
                console.error(err);
            } else {
                cb(users[0][params.field]);
            }
        });
};

module.exports = mongoose.model('Users', userSchema);
