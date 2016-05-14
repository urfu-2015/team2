'use strict';

const mongoose = require('./mongooseConnect');
const clearDB = require('./clearDB');

const async = require('async');
const create = require('./createDocuments');
const constants = require('./constantsForFakeData');

let functions = [];
let usersId = [];
let questsId = [];
let stagesId = [];

function setUserData() {
    for (let i = 0; i < constants.PEOPLE_COUNT; i++) {
        let currentId = mongoose.Types.ObjectId();
        usersId.push(currentId);
        functions.push(create.newUser.bind(null, currentId));
    }
}

function setQuestsData() {
    let currentId = mongoose.Types.ObjectId();
    let currentLikesCount = Math.floor(Math.random() * constants.MAX_LIKES_COUNT);
    let currentDoneCount = Math.floor(Math.random() * constants.MAX_DONE_COUNT);
    let currentDislikesCount = Math.floor(Math.random() * constants.MAX_DISLIKES_COUNT);

    questsId.push(currentId);
    functions.push(create.newQuest.bind(null, currentId,
        usersId[Math.floor(Math.random() * constants.PEOPLE_COUNT)],
        currentLikesCount, currentDislikesCount, currentDoneCount));

    // Сразу создаем лайки, дизлайки, и отмечаем статус квеста у пользователей
    for (let j = 0; j < currentLikesCount; j++) {
        functions.push(create.newQuestLike.bind(null, currentId, true,
            usersId[Math.floor(Math.random() * constants.PEOPLE_COUNT)]));
    }
    for (let j = 0; j < currentDislikesCount; j++) {
        functions.push(create.newQuestLike.bind(null, currentId, false,
            usersId[Math.floor(Math.random() * constants.PEOPLE_COUNT)]));
    }
    for (let j = 0; j < currentDoneCount; j++) {
        functions.push(create.newQuestStatus.bind(null, currentId,
            usersId[Math.floor(Math.random() * constants.PEOPLE_COUNT)],
            'done'));
    }
    return currentId;
}

function setStagesData() {
    let currentLikesCount = Math.floor(Math.random() * constants.MAX_LIKES_COUNT);
    let currentDislikesCount = Math.floor(Math.random() * constants.MAX_DISLIKES_COUNT);
    let currentId = mongoose.Types.ObjectId();

    stagesId.push(currentId);
    functions.push(create.newStage.bind(null, currentId,
        questsId[Math.floor(Math.random() * constants.QUESTS_COUNT)],
        currentLikesCount, currentDislikesCount));

    for (let j = 0; j < currentLikesCount; j++) {
        functions.push(create.newStageLike.bind(null, currentId, true,
            usersId[Math.floor(Math.random() * constants.PEOPLE_COUNT)]));
    }
    for (let j = 0; j < currentDislikesCount; j++) {
        functions.push(create.newStageLike.bind(null, currentId, false,
            usersId[Math.floor(Math.random() * constants.PEOPLE_COUNT)]));
    }
    return currentId;
}

function setCommentsData() {
    for (let i = 0; i < constants.COMMENTS_COUNT; i++) {
        let userId = usersId[Math.floor(Math.random() * constants.PEOPLE_COUNT)];
        if (i % 2 === 0) {
            let questId = questsId[Math.floor(Math.random() * constants.QUESTS_COUNT)];
            functions.push(create.newQuestComment.bind(null, questId, userId));
        } else {
            let stageId = stagesId[Math.floor(Math.random() * constants.STAGES_COUNT)];
            functions.push(create.newStageComment.bind(null, stageId, userId));
        }
    }
}

function setCheckins() {
    let countStageDone = 5;
    let countStageNotDone = 3;
    for (let i = 0; i < constants.MAX_STARTED_COUNT; i++) {
        let questId = setQuestsData();
        let userId = usersId[Math.floor(Math.random() * constants.PEOPLE_COUNT)];
        for (let j = 0; j < countStageDone; j++) {
            let stageId = setStagesData();
            functions.push(create.newCheckins.bind(null, questId, userId, stageId));
        }
        for (let j = 0; j < countStageNotDone; j++) {
            setStagesData();
        }
        functions.push(create.newQuestStatus.bind(null, questId, userId, 'started'));
    }
}

function setInitialData() {
    for (let i = 0; i < constants.QUESTS_COUNT; i++) {
        setQuestsData();
    }
    for (let i = 0; i < constants.STAGES_COUNT; i++) {
        setStagesData();
    }
    setUserData();
    setCommentsData();
    setCheckins();
}

function fillDB() {
    setInitialData();
    async.parallel(functions, err => {
        mongoose.disconnect();
        console.log('Done!');
    });
}

function main() {
    clearDB(() => {
        fillDB();
    });
}

main();
