const asyncRedis = require("async-redis");
const redisPort = process.env.REDIS_PORT || 6379;
const redisClient = asyncRedis.createClient(redisPort);

//known WebStorm issue when loading a json array from a file  - an elegant workaround..
let initRedisDetails;
initRedisDetails = require('../init_data/apps-details');

redisClient.on('connect', function () {
    console.log(`Redis client connected, port: ${redisPort}`);
});

redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});


/**
 * in-memory global cache
 * @type {{}}
 */
let appDetails = {};


module.exports = {

    appDetails: appDetails,

    /**
     * initialize the data structure convention from lib/init_data
     * @returns {Promise<*>}
     */
    init: async () => {

        return await initRedisDetails.map(async appDetail => {
            let key = appDetail.name;
            //redis only accepts string values inside its hashmaps,
            //in order to keep thei n-memory value an array , a clone of this value is needed before stringifying it.
            appDetails[key] = JSON.parse(JSON.stringify(appDetail));
            appDetail.agesInstalled = JSON.stringify(appDetail.agesInstalled);
            await saveObject(key, appDetail);
        })

    },

    /**
     * save every installedApp post request
     * - increment the actual age in the relevant object's instealledApp field
     * if the age index value is null, init with 1 (first app install)
     * - recalculate the average ages and save to averageAge fields
     * - save to db.
     *
     * @param installedApp
     * @param age
     * @param res
     * @returns {Promise<void>}
     */
    addInstalledApp: async (installedApp, age, res) => {
        try {
            let appDetail = appDetails[installedApp];

            if(typeof age === 'string')
                age = parseInt(age);

            if (typeof appDetail.agesInstalled === 'string')
                appDetail.agesInstalled = JSON.parse(appDetail.agesInstalled);

            //increment the age by its index (by convention)
            if (appDetail.agesInstalled[age] && appDetail.agesInstalled[age] > 0) {
                appDetail.agesInstalled[age]++;
            } else {
                appDetail.agesInstalled[age] = 1;
            }

            appDetail.averageAge = getAgeAverage(appDetail.agesInstalled);

            appDetail.agesInstalled = JSON.stringify(appDetail.agesInstalled);

            await saveObject(installedApp, appDetail);

            res.send("ok")

        } catch (err) {
            res.status(400).send(err.message);
        }
    },

    getAppsDetailsLength: () => {
        return Object.keys(appDetails).length;
    },

    getAgeAverage: getAgeAverage

};

/**
 * since the data structure is designed as a single array of ages indexes that each value represents the age count
 * it will be very straight forward to calculate the age average.
 *
 * @param agesArr
 * @returns {string}
 */
function getAgeAverage(agesArr) {
    if (typeof agesArr === 'string')
        agesArr = JSON.parse(agesArr);

    var installedAppsCount = 0;
    let agesSum = agesArr.reduce((sum, ageCount, ageIndex) => {
        installedAppsCount += ageCount;
        sum += (ageCount * ageIndex);
        return sum;
    }, 0);

    let average = agesSum / installedAppsCount;
    return average.toFixed();
}

async function getString(key) {
    return await redisClient.get(key);
}

async function getObject(key) {
    return await redisClient.hgetall(key);
}

async function saveObject(key, value) {
    return await redisClient.hmset(key, value);
}
