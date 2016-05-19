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
        threshold: 50
    });
});
