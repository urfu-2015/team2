require('./questForm.css');
const stageFunctions = require('../stage-editor/stageEditor.js');
const stageTemplate = require('../stage-editor/stageEditor.hbs');

let stagesContainer = document.querySelector('.quest-form__stages');

document.querySelector('.quest-form__new-stage-button').addEventListener('click', addStage);

addStage();

document.querySelector('.quest-form__submit').addEventListener('click', () => {
    let stagesData = getStages();

    var fileInput = document.querySelector('.quest-form__photo-input');

    var reader = new FileReader();

    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('load', () => {
        var data = {
            quest: {
                file: reader.result,
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
        }).done(function (result) {
//            console.log(result);
        }).fail(function (err) {
//            console.log(err);
        });
    });
});

function addStage() {
    let data = {
        stage: {
            id: stagesContainer.children.length
        }
    };

    $('.quest-form__stages').append($.parseHTML(stageTemplate(data)));
    stageFunctions.setImageSelectHandler(stagesContainer.lastElementChild);
}

function getStages() {
    let stagesData = [];
    let stages = [].slice.apply(stagesContainer.children);

    stages.forEach((stage) => {
        stagesData.push(stageFunctions.getStageData(stage));
    });

    return stagesData;
}
