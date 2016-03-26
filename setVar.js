const argv = require('minimist')(process.argv.slice(2));

process.env.AUTH0_CLIENTSECRET = argv.AUTH0_CLIENTSECRET;
