require('./quest_comments.css');
require('../comments/comments');

import { showError } from '../errors/scripts/clientErrors';

const comments = require('../comments/comments.hbs');

(() => {
    document.querySelector('.quest-comments__show-button')
        .addEventListener('click', showComments);
    document.querySelector('.quest-comments__add-comment-button')
        .addEventListener('click', addComment);
})();

function showComments() {
    $('#quest-comments').modal(); // Активируем модальное окно
    $('#quest-comments').modal('show');
    $('#quest-comments').scrollTop(0);

    $('#quest-comments').on('hidden.bs.modal', function (e) {
        $(this).find('.modal-body p').text('Подождите пожалуйста...');
    });

    const id = document.querySelector('#questId').value;
    const data = {
        commentType: 'quest',
        id
    };

    $.ajax({
        url: location.pathname,
        data,
        type: 'PUT'
    }).done(function (result) {
        document.querySelector('.quest-comments__comments-container')
            .innerHTML = comments({ comments: result });
    });
}

function addComment() {
    const id = document.querySelector('#questId').value;
    const text = document.querySelector('.quest-comments__text').value;
    const data = {
        commentType: 'quest',
        id,
        text
    };

    $.ajax({
        url: location.pathname,
        data,
        type: 'POST'
    }).done(function (result) {
        const newComment = $.parseHTML(comments({ comments: [result] }));

        $('.quest-comments__comments-container').append(newComment);
    }).fail(function (err) {
        if (err.status === 401) {
            showError({ text: err.responseText });
            return;
        }
        showError({ text: 'Неизвестная ошибка' });
    });
}
