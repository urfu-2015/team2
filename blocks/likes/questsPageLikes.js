import { showError } from '../errors/scripts/clientErrors';

var pathname = window.location.pathname;

$().ready(function () {
    // надо запросить, поставил ли этот пользователь лайк к квесту
    $.ajax({
        url: pathname + '/stats',
        type: 'GET'
    }).done(function (res) {
        if (!res.questsLikes) {
            return;
        }
        res.questsLikes.forEach(like => {
            if (like.type) {
                $('.quest-stats.quest-stats_' + like.questId)
                    .find('.stats__like-img')
                    .removeClass('stats__like-img_empty').addClass('stats__like-img_filled');
            }
        });
    }).fail(function (err) {
        console.error('err');
    });
});

$('.stats__like-img').click(function () {
    var $self = $(this);

    // если поставили лайк
    var $likesCount = $self.next().text().trim();
    $likesCount = Number($likesCount);
    if ($self.hasClass('stats__like-img_empty')) {
        $self.removeClass('stats__like-img_empty').addClass('stats__like-img_filled');
        $self.next().html($likesCount + 1);
    } else {
        $self.removeClass('stats__like-img_filled').addClass('stats__like-img_empty');
        $self.next().html($likesCount - 1);
    }

    var $dataId = $self.parents('.quest-stats').data('id');
    $.ajax({
        url: pathname + '/stats/like',
        type: 'PUT',
        data: JSON.stringify({
            questId: $dataId
        }),
        contentType: 'application/json'

    }).fail(function (err) {
        $self.removeClass('stats__like-img_filled').addClass('stats__like-img_empty');
        $self.next().html($likesCount);
        showError({ text: 'Вы должны авторизоваться, чтобы ставить лайки' });
    });

});
