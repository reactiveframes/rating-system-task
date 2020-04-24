require('dotenv').config();
const redis = require('../lib/orm/redis');
delete process.env.SERVER_UNDER_UNIT_TEST;
const server = require('./../app');



module.exports = {
    app: server,
    appDetails: redis.appDetails,
    getAppsDetailsLength: redis.getAppsDetailsLength,
    timeout: 10000
};