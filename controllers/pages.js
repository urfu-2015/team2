'use strict';

const fs = require('fs');
const layouts = require('handlebars-layouts');

const handlebars = require('hbs').handlebars;
handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('base', fs.readFileSync('./bundles/base.hbs', 'utf8'));

let quests = [{
        name: 'name',
        city: 'city',
        author: 'author',
        description: 'description',
        likesCount: 6,
        dislikesCount: 7
    },
    {
        name: 'name',
        city: 'city',
        author: 'author',
        description: 'description',
        likesCount: 6,
        dislikesCount: 7
    }
];

exports.quests = (req, res) => {
    const template = handlebars.compile(fs.readFileSync('./bundles/quests/quests.hbs', 'utf8'));

    const data = {
        currentCity: 'Екатеринбург',
        quests: quests
    };
    res.send(template(Object.assign(data, req.commonData)));

};

exports.index = (req, res) => {
    const template = handlebars.compile(fs.readFileSync('./bundles/main/main.hbs', 'utf8'));
    const data = {
        currentCity: 'Екатеринбург'
    };
    res.send(template(Object.assign(data, req.commonData)));
};

exports.error404 = (req, res) => res.sendStatus(404);
