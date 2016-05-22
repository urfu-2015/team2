require('./quests.css');
const likesFunctions = require('../../blocks/likes/questsPageLikes.js');
const questTemplate = require('../../blocks/quest_block/quest_block.hbs');

$(document).ready(function () {
    $(document).on('click.card', '.card', function (b) {
        $(this).find('> .card-reveal').length &&
            ($(b.target).is($('.card-reveal i')) ? $(this).find('.card-reveal').velocity({
            translateY: 0
        }, {
            duration: 225,
            queue: !1,
            easing: 'easeInOutQuad',
            complete: function () {
                $(this).css({
                    display: 'none'
                });
            }
        }) : ($(b.target).is($('.card .activator')) ||
            $(b.target).is($('.card .activator img')) ||
            $(b.target).is($('.card .activator i'))) &&
            ($(b.target).closest('.card').css('overflow', 'hidden'),
            $(this).find('.card-reveal').css({
                display: 'block'
            }).velocity('stop', !1).velocity({
                translateY: '-100%'
            }, {
                duration: 300,
                queue: !1,
                easing: 'easeInOutQuad'
            }))),
            $('.card-reveal').closest('.card').css('overflow', 'hidden');
    });

    moreButton.addEventListener('click', (event) => {
        moreButton.disabled = true;
        getPartOfQuests();
    });

});

var oldDate = document.querySelector('.quests-block').lastElementChild.dataset.createdAt;
var query = document.querySelector('.quest-search__input').value;
var moreButton = document.querySelector('.quests-block__more-button');

function getPartOfQuests() {

    let data = {
        count: 8
    };

    if (oldDate) {
        data.oldDate = oldDate;
    }

    if (query) {
        data.query = query;
    }

    $.ajax({
        url: '/api/quests',
        type: 'GET',
        data: data
    }).done(function (result) {
        result.data.quests.forEach((quest => {
            $('.quests-block').append($.parseHTML(questTemplate(quest)));

            likesFunctions.setLikeHandler(
                document.querySelector('.quests-block').lastElementChild
            );
        }));

        oldDate = result.oldDate;

        if (result.isQuestsOver) {
            return;
        }

        moreButton.disabled = false;
    }).fail(function (error) {
        console.log(error);
        moreButton.disabled = false;
    });

}
