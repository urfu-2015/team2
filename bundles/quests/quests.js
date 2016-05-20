require('./quests.css');

$(document).ready(function () {
    console.log('here');
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
});
