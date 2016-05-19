require('./quest_page_controls.css');


$(document).ready(() => {
    $('button.begin').on('click',() => {
        let questId = $('#questId').val();
        const data = {
            questId: questId
        };

        const checkinModal = $('#checkin-modal');
        checkinModal.modal(); // Активируем модальное окно
        checkinModal.modal('show');
        checkinModal.scrollTop(0);

        checkinModal.on('hidden.bs.modal', function (e) {
            $(this).find('.modal-body p').text('Подождите пожалуйста...');
        });
        checkinModal.on('hide.bs.modal', function (e) {
            location.reload();
        });

        $.ajax({
            url: '/quests/start',
            type: 'POST',
            data: data
        }).done(result => {
            console.log(result);
            let modalBody = checkinModal.find('.modal-body p');
            let text = 'Поздравляем, вы успешно начали новый квест!';
            modalBody.text(text);
        }).fail(err => {
            console.log(err);
            let modalBody = checkinModal.find('.modal-body p');
            let text;
            switch (err.status) {
                case 401:
                    text = 'Извините, но начинать проходить квест могут только зарегистрированные пользователи..';
                    break;
                case 400:
                    text = 'Извините, но вы уже начали проходить данный квест.';
                    break;
                default:
                    text = 'Извините, произошла внутренняя ошибка сервиса, попробуйте еще раз.';
            }
            modalBody.text(text);
        });
    })

});
