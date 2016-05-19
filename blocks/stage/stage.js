require('./stage.css');

$(document).ready(function () {
    var $lightbox = $('#lightbox');

    $('[data-target="#lightbox"]').on('click', function (event) {
        var $img = $(this).find('img');

        $lightbox.find('img').attr('src', $img.attr('src'));
        $lightbox.find('img').attr('alt', $img.attr('alt'));
    });
});
