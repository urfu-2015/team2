'use strict';

const Quest = require('../models/quests');

module.exports.searchByQuery = (req, res) => {
    let query = { name: { $regex: new RegExp(req.query.query, 'i') } };

    Quest.getQuestsData(req, query, 9)
        .then(data => {
            if (data.quests.length < 9) {
                data.noMoreQuests = true;
            } else {
                data.quests.pop();
            }

            res.render('quests/quests', Object.assign(data, req.commonData));
        })
        .catch(err => {
            console.log(err);
            req.commonData.errors.push({
                text: 'Some errors with getting quest'
            });
            res.redirect('/');
        });
};
