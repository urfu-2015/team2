require('./quest_comments.css');
require('../comments/comments');

const comments = require('../comments/comments.hbs');

(() => {
    document.querySelector('.quest-comments__show-button')
        .addEventListener('click', showComments);
    document.querySelector('.quest-comments__add-comment-button')
        .addEventListener('click', addComment);
})();

function showComments() {
    const commentsWrapperClasses =
        document.querySelector('.quest-comments__comments-wrapper').classList;
    const hiddenClassIndex =
        Array.prototype.indexOf.call(commentsWrapperClasses, 'quest-comments_hidden');
    if (hiddenClassIndex >= 0) {
        commentsWrapperClasses.remove('quest-comments_hidden');
    } else {
        commentsWrapperClasses.add('quest-comments_hidden');
        return;
    }
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
        document.querySelector('.quest-comments__comments-container')
            .innerHTML += comments({ comments: [result] });
    });
}
