require('./questForm.css');
require('../add-stage/add-stage.js');
const template = require('../add-stage/add-stage.hbs');

$('.quest-form__new-stage-button').click(function (event) {
    $('.quest-form__stages').append($.parseHTML(template()));
});

$('.quest-form__stages').append($.parseHTML(template()));

$('.quest-form__submit').click(function (event) {
    var questData = {
        name: $('.quest-form__name-input').value,
        city: $('.quest-form__city-input').value,
        description: $('.quest-form__description-input').value
    };
});
