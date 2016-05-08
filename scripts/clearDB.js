'use strict';

const config = require('config');
const argv = require('minimist')(process.argv.slice(4));
const dbURL = (argv.STATUS === 'testing') ? config.get('db.local') : config.get('db.mongodb_URL');

const mongoose = require('mongoose');

module.exports = done => {
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(dbURL, function (err) {
            if (err) {
                console.error(err);
            }
            return clearDB(done);
        });
    } else {
        return clearDB(done);
    }
};

function clearDB(done) {
    for (let i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(() => {});
    }
    return done();
}
