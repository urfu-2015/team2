require('./questForm.css');
const stageFunctions = require('../stage-editor/stageEditor.js');
const stageTemplate = require('../stage-editor/stageEditor.hbs');

setImageSelectHandler();

let stagesContainer = document.querySelector('.quest-form__stages');
let stageId = 0;

document.querySelector('.quest-form__new-stage-button').addEventListener('click', addStage);

addStage();

let submitButton = document.querySelector('.quest-form__submit');

submitButton.addEventListener('click', () => {
    submitButton.disabled = true;

    uploadNewQuest();
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
    let data = {
        stage: {
            id: stageId
        }
    };

    stageId++;

    $('.quest-form__stages').append($.parseHTML(stageTemplate(data)));
    stageFunctions.setScripts(stagesContainer.lastElementChild);
}

function getStages() {
    let stagesData = [];
    let stages = [].slice.apply(stagesContainer.children);

    stages.forEach((stage) => {
        stagesData.push(stageFunctions.getStageData(stage));
    });

    return stagesData;
}

function uploadNewQuest() {
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

    $.ajax({
        url: '/quests',
        type: 'POST',
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
