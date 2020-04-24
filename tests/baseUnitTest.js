const redis = require('../lib/orm/redis');
process.env.SERVER_UNDER_UNIT_TEST = true;
require('dotenv').config();

//not requiring the server, so initializing the data
redis.init().then();

module.exports = {
    appDetails: redis.appDetails,
    getAppsDetailsLength: redis.getAppsDetailsLength
};