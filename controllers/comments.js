'use strict';

const QuestComment = require('../models/questsComments');
const StageComment = require('../models/stagesComments');
const User = require('../models/user');
const mongoose = require('mongoose');

const createComment = (req, res) => {
    if (!req.user) {
        res.status(401).send('Вы не авторизованы');
        return;
    }
    const data = {
        text: req.body.text,
        userId: mongoose.Types.ObjectId(req.user._json.mongo_id)
    };

    if (req.body.commentType === 'quest') {
        createQuestComment(data, req, res);
    } else if (req.body.commentType === 'stage') {
        createStageComment(data, req, res);
    }

};

const createQuestComment = (data, req, res) => {
    data.questId = mongoose.Types.ObjectId(req.body.id);
    const newQuestComment = new QuestComment(data);
    const dataToResponse = getDataToRespnose(req, data);

    saveComment(newQuestComment, res, dataToResponse);
};

const createStageComment = (data, req, res) => {
    data.stageId = mongoose.Types.ObjectId(req.body.id);
    const newStageComment = new StageComment(data);
    const dataToResponse = getDataToRespnose(req, data);

    saveComment(newStageComment, res, dataToResponse);
};

const getDataToRespnose = (req, data) => {
    const res = Object.assign({}, data);

    res.avatar = req.user._json.picture;
    res.login = req.user._json.nickname;
    return res;
};

const saveComment = (comment, res, dataToResponse) => {
    comment.save(function (err, comment) {
        if (err) {
            console.error('Error on comment save: ' + err);
            return;
        }
        res.json(dataToResponse);
    });
};

const getComments = (req, res) => {
    if (req.body.commentType === 'quest') {
        getQuestComments(req, res);
    } else if (req.body.commentType === 'stage') {
        getStageComments(req, res);
    }
};

const getStageComments = (req, res) => {
    const query = { stageId: req.body.id };

    StageComment.findComments(query, (data) => {
        addUserInfoAndSend(res, data);
    });
};

const getQuestComments = (req, res) => {
    const query = { questId: req.body.id };

    QuestComment.findComments(query, (data) => {
        addUserInfoAndSend(res, data);
    });
};

const addUserInfoAndSend = (res, data) => {
    const idsQuery = [];

    data.forEach((item) => {
        idsQuery.push({ _id: item.userId });
    });
    if (idsQuery.length === 0) {
        res.json([]);
        return;
    }
    User.findUser({ $or: idsQuery })
        .then((users) => {
            const dataToSend = [];

            data.forEach((comment) => {
                const user = users.find(element => element._id.id === comment.userId.id);
                const commentToSend = {
                    text: comment.text,
                    avatar: user.avatar,
                    login: user.login
                };

                dataToSend.push(commentToSend);
            });
            res.json(dataToSend);
        });
};

module.exports = {
    getComments,
    createComment
};
