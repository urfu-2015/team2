'use strict';

const mongoose = require('mongoose');
const config = require('config');

const argv = require('minimist')(process.argv.slice(4));

const dbUrl = process.env.DB_CONNECT || (argv.STATUS === 'testing') ?
    config.get('db.local') : config.get('db.mongodb_URL');
console.log(dbUrl);

mongoose.connect(dbUrl);
mongoose.connection.on('error', console.error.bind(console, 'connection error'));

module.exports = mongoose;
