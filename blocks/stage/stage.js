require('./stage.css');

$(document).ready(function () {
    var $lightbox = $('#stage-modal');

    $('[data-target="#stage-modal"]').on('click', function (event) {
        var $img = $(this).find('img');

        $lightbox.find('img').attr('src', $img.attr('src'));
        $lightbox.find('img').attr('alt', $img.attr('alt'));
    });
});
