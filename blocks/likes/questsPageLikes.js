import { showError } from '../errors/scripts/clientErrors';

var pathname = window.location.pathname;

pathname = pathname === '/search' ? '/quests' : pathname;

pathname = pathname.startsWith('/user') ? '/quests' : pathname;

$('.stats__like-img').click(likeHandler);

function likeHandler() {
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
}

module.exports.setLikeHandler = (element) => {
    let $like = $(element.querySelector('.stats__like-img'));

    $like.click(likeHandler);
};

