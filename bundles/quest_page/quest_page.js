require('./quest_page.css');
const stagesScripts = require('../../blocks/stages/stages');
require('../../blocks/stage/stage');
require('../../blocks/likes/fullQuestLikes.js');

require('../../blocks/stages/stages');
require('../../blocks/quest_page_controls/quest_page_controls');
require('../../blocks/quest_comments/quest_comments');

const render = require('../../blocks/quest_page_controls/quest_page_controls.hbs');

$(document).ready(() => {
    $('button.begin').on('click', () => {
        let questId = $('#questId').val();
        const data = {
            questId: questId
        };

        $('#checkin-modal').modal(); // Активируем модальное окно
        $('#checkin-modal').modal('show');
        $('#checkin-modal').scrollTop(0);

        $('#checkin-modal').on('hidden.bs.modal', function (e) {
            $(this).find('.modal-body p').text('Подождите пожалуйста...');
        });

        $.ajax({
            url: '/quests/start',
            type: 'POST',
            data: data
        }).done(result => {
            let modalBody = $('#checkin-modal').find('.modal-body p');
            let text = 'Поздравляем, вы успешно начали новый квест!';
            $('.quest-page-controls').after($.parseHTML(render({
                quest: {
                    _id: questId
                },
                started: true
            })));
            $('.quest-page-controls').first().remove();

            $('.stage-checkin__button').each(function () {
                $(this).prop('disabled', false);
                $(this).addClass('begin');
                $(this).on('click', stagesScripts.checkinButtonHandler);
            });

            modalBody.text(text);
        }).fail(err => {
            console.log(err);
            let modalBody = $('#checkin-modal').find('.modal-body p');
            let text;
            switch (err.status) {
                case 401:
                    text = 'Извините, но начинать проходить квест ' +
                        'могут только зарегистрированные пользователи..';
                    break;
                case 400:
                    text = 'Извините, но вы уже начали проходить данный квест.';
                    break;
                default:
                    text = 'Извините, произошла внутренняя ошибка сервиса, попробуйте еще раз.';
            }
            modalBody.text(text);
        });
    });
});
