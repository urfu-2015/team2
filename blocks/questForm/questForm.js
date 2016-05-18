require('./questForm.css');
const stageFunctions = require('../stageEditor/stageEditor.js');
const stageTemplate = require('../stageEditor/stageEditor.hbs');
const clientErrors = require('../errors/scripts/clientErrors.js');

setImageSelectHandler();

let stagesContainer = document.querySelector('.quest-form__stages');
let stageId = 0;
let isEditing = false;
let questId = document.querySelector('.quest-form').dataset.questId;
let editingStages = [];

if (questId !== '') {
    initEditing();
} else {
    addStage();
}

document.querySelector('.quest-form__new-stage-button').addEventListener('click', addStage);

let submitButton = document.querySelector('.quest-form__submit');

submitButton.addEventListener('click', () => {
    submitButton.disabled = true;
    clientErrors.removeErrors();

    try {
        uploadQuest();
    } catch (err) {
        clientErrors.showError({ text: err.message });
        submitButton.disabled = false;
    }
});

function setImageSelectHandler() {
    let fileInput = document.querySelector('.quest-form__photo-input');

    fileInput.addEventListener('change', () => {
        var reader = new FileReader();

        reader.readAsDataURL(fileInput.files[0]);
        reader.addEventListener('load', () => {
            document.querySelector('.quest-form__photo-preview').src = reader.result;
        });
    });
}

function addStage() {

    $('.quest-form__stages').append($.parseHTML(stageTemplate()));

    stageId++;
    stagesContainer.lastElementChild.dataset.editStageId = stageId;

    stageFunctions.setScripts(stagesContainer.lastElementChild);
}

function getStages() {
    let stagesData = [];
    let stages = [].slice.apply(stagesContainer.children);
    let isStageInRequest = {};

    stages.forEach((stage, index) => {
        let data = stageFunctions.getStageData(stage);

        data.order = index;

        if (data.edited) {
            isStageInRequest[data.id] = true;
        }

        stagesData.push(data);
    });

    editingStages.forEach((id) => {
        if (!isStageInRequest[id]) {
            stagesData.push({
                id: id,
                removed: true
            });
        }
    });

    return stagesData;
}

function uploadQuest() {
    let stagesData = getStages();

    let data = {
        quest: {
            file: document.querySelector('.quest-form__photo-preview').getAttribute('src'),
            name: document.querySelector('.quest-form__name-input').value,
            city: document.querySelector('.quest-form__city-input').value,
            description: document.querySelector('.quest-form__description-input').value,
            stages: stagesData
        }
    };

    if (isEditing && !data.quest.file.startsWith('data:image')) {
        delete data.quest.file;
    }

    checkData(data);

    let url = '/quests' + (isEditing ? `/${questId}` : '');
    let type = isEditing ? 'PATCH' : 'POST';

    $.ajax({
        url: url,
        type: type,
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function (questId) {
        console.log(questId);
        window.location.href = `/quests/${questId}`;
    }).fail(function (err) {
        console.log(err);
        submitButton.disabled = false;
    });
}

function checkData(data) {
    if (data.quest.file === '' && !isEditing) {
        throw new Error('Не указана картинка квеста');
    }
    if (data.quest.name === '') {
        throw new Error('Не указано название квеста');
    }
    if (data.quest.city === '') {
        throw new Error('Не указан город квеста');
    }
    if (data.quest.description === '') {
        throw new Error('Не указано описание квеста');
    }
    if (data.quest.stages.length === 0) {
        throw new Error('Нельзя добавить квест без этапов');
    }
    data.quest.stages.forEach((stage) => {
        if (stage.removed) {
            return;
        }
        if (stage.file === '' && !stage.editing) {
            throw new Error('Не указана картинка этапа');
        }
        if (stage.name === '') {
            throw new Error('Не указано название этапа');
        }
        if (stage.description === '') {
            throw new Error('Не указано описание этапа');
        }

        //if (stage.geolocation === undefined) {
        //    throw new Error('Не указано местоположение этапа');
        //}
    });
}

function initEditing() {
    isEditing = true;

    if (stagesContainer.lastElementChild) {
        stageId = stagesContainer.lastElementChild.dataset.editStageId;
    }

    let stages = [].slice.apply(stagesContainer.children);

    stages.forEach((stage) => {
        stageFunctions.setScripts(stage);
        editingStages.push(stageFunctions.getStageId(stage));
    });

    let deleteQuestButton = document.querySelector('.quest-form_editing__delete-quest-button');

    deleteQuestButton.addEventListener('click', () => {
        deleteQuestButton.disabled = true;

        $.ajax({
            url: `/quests/${questId}`,
            type: 'DELETE',
            data: '',
            contentType: 'application/json'
        }).done(function () {
            window.location.href = '/quests';
        }).fail(function (err) {
            console.log(err);
            deleteQuestButton.disabled = false;
        });
    });
}
