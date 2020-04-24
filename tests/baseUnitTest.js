let redis = require('../lib/orm/redis');
process.env.SERVER_UNDER_UNIT_TEST = true;
require('dotenv').config();

    redis.init().then();

module.exports = {
    appDetails: redis.appDetails,
    getAppsDetailsLength: redis.getAppsDetailsLength
};