require('./questForm.css');
/*
require('../add-stage/add-stage.js');
const template = require('../add-stage/add-stage.hbs');
*/

$('.quest-form__new-stage-button').click(function (event) {
    $('.quest-form__stages').append($.parseHTML(template()));
});
