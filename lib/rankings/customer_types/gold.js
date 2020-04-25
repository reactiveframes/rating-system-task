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

    /**
     * This customer type uses a binary search to get the closest value of the given age query param
     * it will also search for unique indexes just like the other types in order to return a response with distinct apps
     *
     * a dedicated unit test is @ tests/unit/goldTest.js
     * @param res
     * @param age
     * @param category
     * @returns {[]}
     */
    getApps: (res, age, category) => {


        let selectedApps = [];

        //to prevent duplicates and to not corrupt the in-memory store
        let appDetailsClone = JSON.parse(JSON.stringify(appDetails));


        while (selectedApps.length < randomApplicationsCount) {

            //extract an age index array from the entire in-memory object
            let appsAges = Object.values(appDetailsClone).map(app => parseInt(app.averageAge));

            let {index} = Gold.prototype.getClosestAge(appsAges, age);

            let app = Object.values(appDetailsClone)[index];
            let appName = app.name;
            let appCategory = app.category;

            //if the category isn't relevant, dont add the app to the response
            if(appCategory === category)
                selectedApps.push(appName);

            //on any case, dont return the same app again.
            delete appDetailsClone[appName];
        }

        return process.env.SERVER_UNDER_UNIT_TEST
            ? selectedApps
            : res.send(selectedApps);

    },
    getClosestAge: (agesArr, target)=> {
        let arr = JSON.parse(JSON.stringify(agesArr));
        arr.sort((a,b) => a-b);
        /**
         * A binary search that applies on sorted arrays, splits the array in to 2 on each recursion until it either reaches to 1 last element
         * or it finds that the target value is greated than the last indexed value (array is sorted..)
         *
         * returns the closest age to the age input (see goldTest.js)
         * @param arr
         * @param target
         * @param lo
         * @param hi
         * @returns {*}
         */
        function binarySearch(arr, target, lo = 0, hi = arr.length - 1) {
            if (target < arr[lo]) {
                return arr[0]
            }
            if (target > arr[hi]) {
                return arr[hi]
            }

            const mid = Math.floor((hi + lo) / 2);

            if (hi - lo < 2) {
                if ((target - arr[lo]) < (arr[hi] - target)) {
                    return arr[lo];
                } else {
                    return arr[hi]
                }
            } else if (target < arr[mid]) {
                return binarySearch(arr, target, lo, mid);
            } else if (target > arr[mid]) {
                return binarySearch(arr, target, mid, hi)
            } else {
                return arr[mid]
            }
        }

        //extract the index of the unsorted ages array's
        let closestAge = binarySearch(arr, target);
        let foundIndex = agesArr.indexOf(closestAge);

        return {
            index: foundIndex,
            closestAge: closestAge
        }
    }
};


module.exports = Gold;

