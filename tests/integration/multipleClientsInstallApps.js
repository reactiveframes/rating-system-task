import test from 'ava';

const {chai, orm, timeout, app} = require('../baseApiTest');

const relevantAppRequest = {
    age: 26,
    category: "social",
    customerType: "gold"
};


/**
 * This test demonstrates the rating system by raising up the frequency of facebook,  whatsup and instagram's installations
 * Once a user requests to get a relevant app by his age  & category , of course using the customerType=gold
 * he is supposed to get the up to date closest age average app in that moment in time.
 */
test("integration: multiple clients install apps and get different ratings via 2 getRelevant cycles and hundreds installations in between", async t => {
    t.timeout(timeout);

    const requester = chai.request(app).keepOpen();

    let installAppParamsRequests = [];
    installAppParamsRequests = installAppParamsRequests.concat(generateInstalledAppRequestsParams(20, "facebook", 70));
    installAppParamsRequests = installAppParamsRequests.concat(generateInstalledAppRequestsParams(27, "whatsup", 70));

    const first_InstalledAppRequests = convertToInstalledAppRequests(installAppParamsRequests, requester);
    const getRelevantAppRequest = `/appService/relevantApplication?age=${relevantAppRequest.age}&category=${relevantAppRequest.category}&customerType=${relevantAppRequest.customerType}`;


    //verify initialized average ages
    t.assert(getAppAvgAge("facebook") === 28);
    t.assert(getAppAvgAge("whatsup") === 19);
    t.assert(getAppAvgAge("instagram") === 14);
    //wont be selected because we're asking for category social..
    t.assert(getAppAvgAge("spotify") === 32);


    //install 200 instagram apps so the instagram average age will be 21  >  whatsup avg age = 19
    await Promise.all(first_InstalledAppRequests)
        .then(responses => {
            // console.log(responses);
            return responses;
        })
        .then(() => Promise.resolve(requester.get(getRelevantAppRequest)))
        .then(res => {
            const appsResult = res.body;
            console.log("integration result: " + appsResult);

            t.assert(appsResult.indexOf("facebook") > -1);
            t.assert(appsResult.indexOf("whatsup") > -1);

            //verify that facebook's average age changed from 28 to 27
            t.assert(getAppAvgAge("facebook") === 27);

        })
        //install 120 instagram apps by (26 year olds) so the instagram average age will be 20  >  whatsup avg age = 19
        .then(() => convertToInstalledAppRequests(generateInstalledAppRequestsParams(26, "instagram", 120), requester))
        .then(installedAppReqs => Promise.all(installedAppReqs))
        .then(() => printAllAverages())
        .then(() => {
            return Promise.resolve(requester.get(getRelevantAppRequest))
        })
        .then(res => {
            const appsResult = res.body;
            console.log("integration result: " + appsResult);

            printAllAverages();
            //verify initialized average ages
            t.assert(getAppAvgAge("facebook") === 27);
            t.assert(getAppAvgAge("whatsup") === 19);
            //verify that instagram's avg age has been changed from 14 to 21 after 100 users installed it
            t.assert(getAppAvgAge("instagram") === 20);
            //wont be selected because we're asking for category social..
            t.assert(getAppAvgAge("spotify") === 32);


            //verify that the response contains facebook and instagram, since now now, instagram's avg age > whatsup's age
            t.assert(appsResult.indexOf("facebook") > -1);
            t.assert(appsResult.indexOf("instagram") > -1);

        })
        .then(() => requester.close())
        .then(() => t.assert(true))
        .catch(err => {
            console.error(err);
        });

});


function generateInstalledAppRequestsParams(age, appName, count) {
    return [...Array(count)].map(i => {
        return {'age': age, 'installedApp': appName}
    })
}

function convertToInstalledAppRequests(installedAppRequests, requester) {
    return installedAppRequests.map(req => {
        return requester.post(`/appService/installedApps?age=${req.age}&installedApp=${req.installedApp}`)
    });
}

function printAllAverages() {
    console.log("facebook avg: " + getAppAvgAge("facebook"));
    console.log("whatsup avg: " + getAppAvgAge("whatsup"));
    console.log("instagram avg: " + getAppAvgAge("instagram"));
    console.log("spotify avg: " + getAppAvgAge("spotify"))
}

function getAppAvgAge(appName) {
    let result = orm.getAgeAverage(orm.appDetails[appName].agesInstalled)
   return typeof result === "string"
        ? parseInt(result)
        : result
}

