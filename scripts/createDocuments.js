const User = require('../models/user');
const Quests = require('../models/quests');
const Stages = require('../models/stages');
const QuestsLikes = require('../models/questsLikes');
const QuestsComments = require('../models/questsComments');
const QuestsStatus = require('../models/questsStatus');
const StagesLikes = require('../models/stagesLikes');
const StagesComments = require('../models/stagesComments');
const Checkins = require('../models/checkins');

const faker = require('faker');
const constants = require('./constantsForFakeData');

module.exports.newUser = (id, cb) => {
    User.create({
        _id: id,
        login: faker.internet.userName(),
        avatar: faker.internet.avatar()
    })
        .then(() => cb());
};

module.exports.newQuest = (id, authorId, likes, dislikes, done, cb) => {
    Quests.create({
        _id: id,
        name: faker.company.companyName(),
        city: faker.address.city(),
        author: authorId,
        description: faker.hacker.phrase(),
        likesCount: likes,
        doneCount: dislikes,
        dislikesCount: done
    })
        .then(() => cb());
};

module.exports.newStage = (id, questId, likes, dislikes, cb) => {
    Stages.create({
        _id: id,
        questId,
        name: faker.company.companyName(),
        geolocation: { latitude: faker.random.number(), longitude: faker.random.number() },
        photo: faker.random.image(),
        hint: faker.hacker.phrase(),
        order: Math.floor(Math.random() * constants.MAX_QUEST_STAGES_COUNT),
        likesCount: likes,
        dislikesCount: dislikes
    })
    .then(() => cb());
};

module.exports.newQuestLike = (questId, type, userId, cb) => {
    QuestsLikes.create({
        questId,
        type,
        userId
    })
        .then(() => cb());
};

module.exports.newQuestComment = (questId, userId, cb) => {
    QuestsComments.create({
        questId,
        text: faker.hacker.phrase(),
        userId
    })
        .then(() => cb());
};

module.exports.newStageLike = (stageId, type, userId, cb) => {
    StagesLikes.create({
        stageId,
        type,
        userId
    })
        .then(() => cb());
};

module.exports.newStageComment = (stageId, userId, cb) => {
    StagesComments.create({
        stageId,
        text: faker.hacker.phrase(),
        userId
    })
        .then(() => cb());
};

module.exports.newQuestStatus = (questId, userId, status, cb) => {
    QuestsStatus.create({
        questId,
        userId,
        status
    })
        .then(() => cb());
};

module.exports.newCheckins = (questId, userId, stageId, cb) => {
    Checkins.create({
        questId,
        stageId,
        userId
    })
        .then(() => cb());
};
