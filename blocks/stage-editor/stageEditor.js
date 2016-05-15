require('./stageEditor.css');

module.exports.setImageSelectHandler = function (element) {
    var fileInput = element.querySelector('.photo-editor__input');

    fileInput.addEventListener('change', () => {
        var reader = new FileReader();

        reader.readAsDataURL(fileInput.files[0]);
        reader.addEventListener('load', () => {
            element.querySelector('.photo-editor__preview').src = reader.result;
        });
    });
};

module.exports.getStageData = function (element) {
    var filePreview = element.querySelector('.photo-editor__preview');
    var nameInput = element.querySelector('.description-editor__title');
    var descriptionInput = element.querySelector('.description-editor__hint');

    return {
        file: filePreview.src,
        name: nameInput.value,
        description: descriptionInput.value
    };
};
