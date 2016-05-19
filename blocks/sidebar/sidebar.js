$('.nav-menu-list__mobile-menu').click(function (e) {
    e.preventDefault();
    $('.wrapper').toggleClass('toggled');
});

$(function () {
    $('.wrapper').swipe({
        swipeLeft: function (event) {
            event.preventDefault();
            if (window.innerWidth < 768) {
                $('.wrapper').removeClass('toggled');
            }
        },
        swipeRight: function (event) {
            event.preventDefault();
            if (window.innerWidth < 768) {
                $('.wrapper').addClass('toggled');
            }
        },
        swipeStatus: function (event, phase) {
            if (phase == 'move' || phase == 'start') {
                var $target = event.target.nodeName;

                if ($target.toLowerCase() === 'input' ||
                    $target.toLowerCase() === 'textarea') {

                    return false;
                }

                $('input').blur();
                $('textarea').blur();
            }
        },
        allowPageScroll: 'auto',
        threshold: 50
    });
});
