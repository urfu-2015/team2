const geolib = require('geolib');

if (!navigator.geolocation) {
    showError({ text: 'Ваш браузер не поддерживает геолокацию' });
} else {
    $('button.checkin').on('click', function () {
        const form = $(this).parents('.stage-checkin');
        const stageId = form.find('[name="stageID"]').val() || 1;
        const questId = form.find('[name="questID"]').val() || 1;

        $('#checkin-modal').modal(); // Активируем модальное окно
        $('#checkin-modal').modal('show');
        $('#checkin-modal').scrollTop(0);

        $('#checkin-modal').on('hidden.bs.modal', function (e) {
            $(this).find('.modal-body p').text('Подождите пожалуйста...');
        });
        $('#checkin-modal').on('hide.bs.modal', function (e) {
            location.reload();
        });

        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                const data = {
                    questId: questId,
                    stageId: stageId,
                    latitude,
                    longitude
                };
                $.ajax({
                    url: '/stages/checkins',
                    type: 'POST',
                    data: data
                }).done(function (result) {
                    console.log(result);
                    let modalBody = $('#checkin-modal').find('.modal-body p');
                    let text;
                    switch (result.checkin) {
                        case true:
                            text = 'Поздравляем! Вы успешно прошли этап квеста!';
                            break;
                        default:
                            text = 'Извините, но вы вне радиуса' + '' +
                                ' принятия отметки. Попробуйте подойти ближе';
                    }
                    modalBody.text(text);
                }).fail(function (err) {
                    let modalBody = $('#checkin-modal').find('.modal-body p');
                    let text;
                    switch (err.status) {
                        case 401:
                            text = 'Извините, но отмечать этап' +
                                ' могут только авторизованные пользователи.';
                            break;
                        default:
                            text = 'Извините, произошла внутренняя' +
                                ' ошибка сервиса, попробуйте еще раз';
                    }
                    modalBody.text(text);
                });
            },
            function (err) {
                let modalBody = $('#checkin-modal').find('.modal-body p');
                modalBody.text('Извините, мы не смогли получить данные о местоположении');
            },
            {
                enableHighAccuracy: true
            }
        );
    });
}
