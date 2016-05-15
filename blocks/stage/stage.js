require('./stage.css');

(function () {
    $(document).ready(function () {
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent)) {
            $('.stage__image').click(function (e) {
                e.preventDefault();
            });
            $('.stage-photo__img').click(function () {
                let $img = $(this);
                let src = $img.attr('src');
                $('body').append(
                    '<div class="stage-photo__img_container">' +
                    '<div class="stage-photo__img_bg"></div>' +
                    '<img src="' + src + '" class="stage-photo__img_big" />' +
                    '</div>');
                $('.stage-photo__img_container').fadeIn(300);
                $('.stage-photo__img_bg').click(hiddenBigImage);
                $('.stage-photo__img_big').click(hiddenBigImage);
            });
        }
    });
    function hiddenBigImage() {
        $('.stage-photo__img_container').fadeOut(300);
        setTimeout(function () {
            $('.stage-photo__img_container').remove();
        }, 300);
    };
}());
