'use strict';

const mongoose = require('mongoose');
const config = require('config');
const dbUrl = process.env.DB_CONNECT || config.get('db.mongodb_URL');

mongoose.connect(dbUrl);
mongoose.connection.on('error', console.error.bind(console, 'connection error'));

module.exports = mongoose;
