require('./questForm.css');
const stageFunctions = require('../stageEditor/stageEditor.js');
const stageTemplate = require('../stageEditor/stageEditor.hbs');
const clientErrors = require('../errors/scripts/clientErrors.js');
const mapFunctions = require('../map/map.js');

let questForm = document.querySelector('.quest-form');

mapFunctions.subscribeOnGeoloactionChanges(questForm);
questForm.addEventListener('mapGeolocationChanged', mapGeolocationChangedHandler);

stageFunctions.subscribeOnGeoloactionChanges(questForm);
questForm.addEventListener('stageGeolocationChanged', stageGeolocationChangedHandler);

setImageSelectHandler();
setDropHandler();

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

mapFunctions.initMap();

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

function mapGeolocationChangedHandler(event) {
    let changedStage = document.querySelector(`[data-edit-stage-id="${event.detail.stageId}"]`);

    stageFunctions.setGeolocation(changedStage, event.detail.geolocation);
}

function stageGeolocationChangedHandler(event) {
    if (event.detail.removed) {
        mapFunctions.removeStage(event.detail.stageId);

        return;
    }

    mapFunctions.addStage(event.detail.stageId, event.detail.geolocation);
}

function setImageSelectHandler() {
    let fileInput = document.querySelector('.quest-form__photo-input');

    fileInput.addEventListener('change', () => handleFileChange(fileInput.files[0]));
}

function setDropHandler() {
    let fileLoader = document.querySelector('.quest-form__photo');

    let $form = $(fileLoader);

    $form.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function () {
            $form.addClass('quest-form__photo_is-dragover');
        })
        .on('dragleave dragend drop', function () {
            $form.removeClass('quest-form__photo_is-dragover');
        })
        .on('drop', function (e) {
            handleFileChange(e.originalEvent.dataTransfer.files[0]);
        });
}

function handleFileChange(file) {
    let reader = new FileReader();

    if (file === undefined) {
        return;
    }

    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
        document.querySelector('.quest-form__photo-preview').src = reader.result;
        document.querySelector('.quest-form__photo')
            .classList.add('quest-form__photo_with-image');

    });
}

function addStage() {

    $('.quest-form__stages').append($.parseHTML(stageTemplate()));

    stagesContainer.lastElementChild.dataset.editStageId = stageId;
    stageId++;

    stageFunctions.initStage(stagesContainer.lastElementChild);
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

    if (stagesData.length === 0) {
        throw new Error('Нельзя добавить квест без этапов');
    }

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

    $('#quest-form__wait-modal').modal('show');

    let url = '/quests' + (isEditing ? `/${questId}` : '');
    let type = isEditing ? 'PATCH' : 'POST';

    $.ajax({
        url: url,
        type: type,
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function (questId) {
        window.location.href = `/quests/${questId}`;
    }).fail(function (err) {
        console.log(err);
        $('#quest-form__wait-modal').modal('hide');
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
        if (stage.file === '' && !stage.edited) {
            throw new Error('Не указана картинка этапа');
        }
        if (stage.name === '') {
            throw new Error('Не указано название этапа');
        }
        if (stage.description === '') {
            throw new Error('Не указано описание этапа');
        }

        if (stage.geolocation === undefined) {
            throw new Error('Не указано местоположение этапа');
        }
    });
}

function initEditing() {
    isEditing = true;

    if (stagesContainer.lastElementChild) {
        stageId = parseInt(stagesContainer.lastElementChild.dataset.editStageId) + 1;
    }

    let stages = [].slice.apply(stagesContainer.children);

    stages.forEach((stage, index) => {
        stageFunctions.initStage(stage);
        editingStages.push(stageFunctions.getStageId(stage));
        mapFunctions.addStage(index, stageFunctions.getGeolocation(stage));
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
