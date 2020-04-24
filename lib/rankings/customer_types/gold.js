const {appDetails} = require('./../../orm/redis');
const randomApplicationsCount = process.env.NUM_OF_RETURNED_APPS;

/**
 Ranking service will rank top 2 relevant apps by age (Y), Based on past feedback from clients (installedApps).
 the calculation of the rating will be as follows:
 For every installed app, an average of the ages of the users that installed them will be saved.
 Upon a new request (contains age), the rating will return the apps that their average is the closest to the age input value.
 Assumptions:
 All ranks are equal if no feedback was given for them.
 If you have several apps with same rank, the order doesn’t matter.
 */
function Gold() {}


Gold.prototype = {
    getApps: (res, age, category) => {


        let selectedApps = [];

        //to prevent duplicates and to not corrupt the in-memory store
        let appDetailsClone = JSON.parse(JSON.stringify(appDetails));


        while (selectedApps.length < randomApplicationsCount) {

            let appsAges = Object.values(appDetailsClone).map(app => parseInt(app.averageAge));

            let {index} = Gold.prototype.getClosestAge(appsAges, age);

            let app = Object.values(appDetailsClone)[index];
            let appName = app.name;
            let appCategory = app.category;

            if(appCategory === category)
                selectedApps.push(appName);

            delete appDetailsClone[appName];
        }

        return process.env.SERVER_UNDER_UNIT_TEST
            ? selectedApps
            : res.send(selectedApps);

    },
    getClosestAge: (arr, target)=> {
        let foundIndex = 0;

        function binarySearch(arr, target, lo = 0, hi = arr.length - 1) {
            if (target < arr[lo]) {
                foundIndex = 0;
                return arr[0]
            }
            if (target > arr[hi]) {
                foundIndex = hi;
                return arr[hi]
            }

            const mid = Math.floor((hi + lo) / 2);

            if (hi - lo < 2) {
                if ((target - arr[lo]) < (arr[hi] - target)) {
                    foundIndex = lo;
                    return arr[lo];
                } else {
                    foundIndex = hi;
                    return arr[hi]
                }
            } else if (target < arr[mid]) {
                return binarySearch(arr, target, lo, mid);
            } else if (target > arr[mid]) {
                return binarySearch(arr, target, mid, hi)
            } else {
                foundIndex = mid;
                return arr[mid]
            }
        }

        let closestAge = binarySearch(arr, target);
        return {
            index: foundIndex,
            closestAge: closestAge
        }
    }
};


module.exports = Gold;

