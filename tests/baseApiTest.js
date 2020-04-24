require('dotenv').config();
let redis = require('../lib/orm/redis');
delete process.env.SERVER_UNDER_UNIT_TEST;
let server = require('./../app');


module.exports = {
    app: server,
    appDetails: redis.appDetails,
    getAppsDetailsLength: redis.getAppsDetailsLength,
    timeout: 10000
};