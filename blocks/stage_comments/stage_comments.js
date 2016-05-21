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
    const commentsWrapperClasses =
        document.querySelector(`section[data-id="${id}"]`).classList;
    const hiddenClassIndex =
        Array.prototype.indexOf.call(commentsWrapperClasses, 'stage-comments_hidden');
    if (hiddenClassIndex >= 0) {
        commentsWrapperClasses.remove('stage-comments_hidden');
    } else {
        commentsWrapperClasses.add('stage-comments_hidden');
        return;
    }
    const data = {
        commentType: 'stage',
        id
    };

    $.ajax({
        url: location.pathname,
        data,
        type: 'PUT'
    }).done(function (result) {
        document.querySelector(`section[data-id="${id}"] > .stage-comments__comments-container`)
            .innerHTML = comments({ comments: result });
    });
}

function addComment(e) {
    const id = e.target.dataset.id;
    const text = document.querySelector(`textarea[data-id="${id}"]`).value;
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
        document.querySelector(`section[data-id="${id}"] > .stage-comments__comments-container`)
            .innerHTML += comments({ comments: [result] });
    });
}
