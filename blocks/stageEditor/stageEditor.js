require('./stageEditor.css');

module.exports.setScripts = function (element) {
    setImageSelectHandler(element);
    setRemoveHandler(element);
};

module.exports.getStageData = function (element) {
    var filePreview = element.querySelector('.photo-editor__preview');
    var nameInput = element.querySelector('.description-editor__title');
    var descriptionInput = element.querySelector('.description-editor__hint');

    var data = {
        file: filePreview.getAttribute('src'),
        name: nameInput.value,
        description: descriptionInput.value
    };

    var stageId = module.exports.getStageId(element);

    if (stageId !== '') {
        data.id = stageId;
        data.edited = true;

        if (!data.file.startsWith('data:image')) {
            delete data.file;
        }
    }

    return data;
};

module.exports.getStageId = function (element) {
    return element.dataset.stageId;
};

function setRemoveHandler(element) {
    element.querySelector('.edit-stage__remove-button').addEventListener('click',
        () => element.parentElement.removeChild(element)
    );
}

function setImageSelectHandler(element) {
    var fileInput = element.querySelector('.photo-editor__input');

    fileInput.addEventListener('change', () => {
        var reader = new FileReader();

        reader.readAsDataURL(fileInput.files[0]);
        reader.addEventListener('load', () => {
            element.querySelector('.photo-editor__preview').src = reader.result;
        });
    });
}
