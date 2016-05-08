'use strict';

const mongoose = require('mongoose');
const config = require('config');

const argv = require('minimist')(process.argv.slice(4));
let dbUrl;

if (process.env.DB_CONNECT) {
    dbUrl = process.env.DB_CONNECT;
} else if (argv.STATUS === 'testing') {
    dbUrl = config.get('db.local');
} else {
    dbUrl = config.get('db.mongodb_URL');
}

mongoose.connect(dbUrl);
mongoose.connection.on('error', console.error.bind(console, 'connection error'));

module.exports = mongoose;
