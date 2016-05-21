import { showError } from '../errors/scripts/clientErrors';

var pathname = window.location.pathname;

$().ready(function () {
    // надо запросить, поставил ли этот пользователь лайк к квесту или этапу
    // Если поставил, то красим лайк/дизлайк
    $.ajax({
        url: pathname + '/stats',
        type: 'GET'
    }).done(function (res) {
        if (res.questLike) {
            if (res.questLike.type) {
                $('.stats__like-img')
                    .first()
                    .removeClass('stats__like-img_empty').addClass('stats__like-img_filled');
            } else {
                $('.stats__dislike-img')
                    .first()
                    .removeClass('stats__dislike-img_empty').addClass('stats__dislike-img_filled');
            }
        }

        // теперь надо пройтись по этапам и для каждого выставить
        if (!res.stagesLikes) {
            return;
        }
        res.stagesLikes.forEach(like => {
            if (like.type) {
                $('.stage-block.stage_' + like.stageId)
                    .find('.stats__like-img')
                    .removeClass('stats__like-img_empty').addClass('stats__like-img_filled');
            } else {
                $('.stage-block.stage_' + like.stageId)
                    .find('.stats__dislike-img')
                    .removeClass('stats__dislike-img_empty').addClass('stats__dislike-img_filled');
            }
        });
    }).fail(function (err) {
        console.error('err');
    });
});

$('.stats__like-img').click(function () {
    var $self = $(this);
    var likesCount = Number($self.next().text().trim());
    var dislikesCount = Number($self.parents('.stats').find('.stats__dislike-count').text().trim());

    // надо понять, что закрашено, а что нет
    if ($self.hasClass('stats__like-img_filled')) {
        // был закрашен лайк и нажали лайк. Надо открасить и вычесть
        $self.addClass('stats__like-img_empty').removeClass('stats__like-img_filled');
        $self.next().html(likesCount - 1);
    } else {
        // лайк не закрашен. Надо посмотреть, закрашен ли дизлайк.
        if ($self.parents('.stats').find('.stats__dislike-img')
                .hasClass('stats__dislike-img_filled')) {
            console.log('dislike filled');
            $self.parents('.stats').find('.stats__dislike-count').html(dislikesCount - 1);
        }
        $self.next().html(likesCount + 1);
        $self.parents('.stats').find('.stats__dislike-img')
            .removeClass('stats__dislike-img_filled').addClass('stats__dislike-img_empty');
        $self.addClass('stats__like-img_filled').removeClass('stats__like-img_empty');
    }

    // здесь надо понять, квест или этап
    var $dataId = $self.parents('.stage-block').data('id');
    $.ajax({
        url: pathname + '/stats/like',
        type: 'PUT',
        data: JSON.stringify({
            type: true,
            stageId: $dataId || null
        }),
        contentType: 'application/json'

    }).fail(function (err) {
        $self.addClass('stats__like-img_empty').removeClass('stats__like-img_filled');
        $self.next().html(likesCount);
        showError({ text: 'Вы должны авторизоваться, чтобы ставить лайки' });
    });

});

$('.stats__dislike-img').click(function () {
    var $self = $(this);
    var $dataId = $self.parents('.stage-stats').data('id');

    var dislikesCount = Number($self.next().text().trim());
    var likesCount = Number($self.parents('.stats').find('.stats__like-count').text().trim());

    if ($self.hasClass('stats__dislike-img_filled')) {
        // был закрашен дизлайк и нажали дизлайк. Надо открасить и вычесть
        $self.addClass('stats__dislike-img_empty').removeClass('stats__dislike-img_filled');
        $self.next().html(dislikesCount - 1);
    } else {
        //  дизлайк не закрашен. Надо посмотреть, закрашен ли лайк.
        if ($self.parents('.stats').find('.stats__like-img').hasClass('stats__like-img_filled')) {
            console.log('like filled');
            $self.parents('.stats').find('.stats__like-count').html(likesCount - 1);
        }
        $self.next().html(dislikesCount + 1);
        $self.parents('.stats').find('.stats__like-img')
            .removeClass('stats__like-img_filled').addClass('stats__like-img_empty');
        $self.addClass('stats__dislike-img_filled').removeClass('stats__dislike-img_empty');
    }

    $.ajax({
        url: pathname + '/stats/like',
        type: 'PUT',
        data: JSON.stringify({
            type: false,
            stageId: $dataId || null
        }),
        contentType: 'application/json'

    }).fail(function (err) {
        $self.addClass('stats__dislike-img_empty').removeClass('stats__dislike-img_filled');
        $self.next().html(dislikesCount);
        showError({ text: 'Вы должны авторизоваться, чтобы ставить дизлайки' });
    });
});
