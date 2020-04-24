const asyncRedis = require("async-redis");
let redisPort = process.env.REDIS_PORT || 6379;
const redisClient = asyncRedis.createClient(redisPort);
// const {appDetails,getAgeAverage} = require('./memory');

//known issue when loading a json array from a file - an elegant workaround..
let initRedisDetails;
initRedisDetails = require('../init_data/apps-details');

redisClient.on('connect', function () {
    console.log(`Redis client connected, port: ${redisPort}`);
});

redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});


let appDetails = {};


function getAgeAverage(agesArr) {
    if (typeof agesArr === 'string')
        agesArr = JSON.parse(agesArr);

    var installedAppsCount = 0;
    let test = agesArr.reduce((sum, ageCount, ageIndex) => {
        installedAppsCount += ageCount;
        sum += (ageCount * ageIndex);
        return sum;
    }, 0);

    let average = test / installedAppsCount;
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


module.exports = {

    appDetails: appDetails,

    init: async () => {

        return await initRedisDetails.map(async appDetail => {
            let key = appDetail.name;
            //redis only accepts string values inside its hashmaps,
            //in order to keep thei n-memory value an array , a clone of this value is needed before stringifying it.
            appDetails[key] = JSON.parse(JSON.stringify(appDetail));
            appDetail.agesInstalled = JSON.stringify(appDetail.agesInstalled);
            await saveObject(key, appDetail);
            // appDetail.agesInstalled = JSON.parse(appDetail.agesInstalled)

        })


    },

    addInstalledApp: async (installedApp, age, res) => {
        // try {
        let appDetail = appDetails[installedApp];

        if (typeof appDetail.agesInstalled === 'string') {
            appDetail.agesInstalled = JSON.parse(appDetail.agesInstalled)
        }

        //increment the age by its index (by convention)
        if (!appDetail.agesInstalled[parseInt(age)]) {
            appDetail.agesInstalled[age] = 1;
        } else {
            appDetail.agesInstalled[age]++;
        }

        appDetail.averageAge = getAgeAverage(appDetail.agesInstalled);

        // let cloneAgesArr = JSON.parse(JSON.stringify(appDetail.agesInstalled));

        appDetail.agesInstalled = JSON.stringify(appDetail.agesInstalled);

        await saveObject(installedApp, appDetail);

        // appDetail.agesInstalled = JSON.parse(appDetail.agesInstalled);

        // res.status(200);
        res.send("ok")
        // }catch(err){
        //     res.status(400).send(err.message);
        // }
    },

    getAppsDetailsLength: () => {
        return Object.keys(appDetails).length;
    },

};