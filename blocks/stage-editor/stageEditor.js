module.exports.uploadStage = function (element, questId, order) {
    var fileInput = element.find('.photo-editor__input');
    var nameInput = element.find('.description-editor__title');
    var descriptionInput = element.find('.description-editor__hint');
    // var latitudeInput = element.find();
    // var longitudeInput = element.find();

    var reader = new FileReader();

    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = function (e) {
        var data = {
            file: reader.result,
            name: nameInput.val(),
            description: descriptionInput.val(),
            // latitude: latitudeInput.val(),
            // longtitude: longitudeInput.val(),
            questId: questId,
            order: order
        };

        $.ajax({
            url: '/stages',
            type: 'POST',
            data: data
        }).done(function (result) {
            //console.log(result);
        }).fail(function (err) {
            //console.log(err);
        });
    };
};
