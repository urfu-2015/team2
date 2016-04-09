const fs = require('fs');
const layouts = require('handlebars-layouts');

// Так нужно сделать, так как внутри handlebars лежит внутренний нужный метод
const hbs = require('hbs');
const handlebars = hbs.handlebars;

// Register helpers
handlebars.registerHelper(layouts(handlebars));

// Register partials
handlebars.registerPartial('base', fs.readFileSync('./bundles/base.hbs', 'utf8'));

exports.quests = (req, res) => {
    const template = handlebars.compile(fs.readFileSync('./bundles/main/main.hbs', 'utf8'));
    res.send(template(req.commonData));

};

exports.index = (req, res) => {
    const template = handlebars.compile(fs.readFileSync('./bundles/main/main.hbs', 'utf8'));
    const data = {
        currentCity: 'Екатеринбург'
    };
    res.send(template(Object.assign(data, req.commonData)));
};

exports.error404 = (req, res) => res.sendStatus(404);
