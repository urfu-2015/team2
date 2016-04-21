'use strict';

const dbURI = require('config').get('db.mongodb_URL');
const mongoose = require('mongoose');

module.exports = done => {
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(dbURI, function (err) {
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
