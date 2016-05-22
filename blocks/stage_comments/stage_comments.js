require('./stage_comments.css');
require('../comments/comments');

const comments = require('../comments/comments.hbs');

(() => {
    const showButtons = document.getElementsByClassName('stage-comments__show-button');

    Array.prototype.forEach.call(showButtons, (button) => {
        button.addEventListener('click', showComments);
    });
    const addButtons = document.getElementsByClassName('stage-comments__add-comment-button');

    Array.prototype.forEach.call(addButtons, (button) => {
        button.addEventListener('click', addComment);
    });
})();

function showComments(e) {
    const id = e.target.dataset.id;
    $(`div.stage-comments[data-id="${id}"]`).modal(); // Активируем модальное окно
    $(`div.stage-comments[data-id="${id}"]`).modal('show');
    $(`div.stage-comments[data-id="${id}"]`).scrollTop(0);

    const data = {
        commentType: 'stage',
        id
    };

    $.ajax({
        url: location.pathname,
        data,
        type: 'PUT'
    }).done(function (result) {
        document.querySelector(`div.stage-comments[data-id="${id}"]` +
            ` .modal-body > .stage-comments__comments-container`)
            .innerHTML = comments({ comments: result });
    });
}

function addComment(e) {
    const id = e.target.dataset.id;
    const text = document.querySelector(`div.stage-comments[data-id="${id}"] textarea`).value;
    const data = {
        commentType: 'stage',
        id,
        text
    };

    $.ajax({
        url: location.pathname,
        data,
        type: 'POST'
    }).done(function (result) {
        document.querySelector(`div.stage-comments[data-id="${id}"]` +
            ` .modal-body > .stage-comments__comments-container`)
            .innerHTML += comments({ comments: [result] });
        document.querySelector(`div.stage-comments[data-id="${id}"] textarea`).value = '';
    }).fail(function (err) {
        if (err.status === 401) {
            showError({ text: err.responseText });
            return;
        }
        showError({ text: 'Неизвестная ошибка' });
    });
}
