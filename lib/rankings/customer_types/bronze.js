const {appDetails, getAppsDetailsLength} = require('./../../orm/redis');
const randomApplicationsCount = process.env.NUM_OF_RETURNED_APPS;
/**
 Ranking service will return 2 apps randomly
 */
function Bronze(options) {
}


Bronze.prototype ={

    /**
     * generating ${randomApplicationsCount} <- env var, random numbers
     * using a Set for generating distinct numbers.
     *
     * a dedicated unit test is @ tests/unit/bronzeTest.js
     * @returns {Set<any>}
     */
    getUniqueRandomNumbers: () => {
        //using a hashset to get distinct random numbers
        const uniqueRandomNums = new Set();
        while(uniqueRandomNums.size < randomApplicationsCount) {
            uniqueRandomNums.add(Math.floor(Math.random() * getAppsDetailsLength()));
        }
        return uniqueRandomNums
    },
    /**
     * the bronze customer type returns a random app indexes from the in-memory store
     * @param res
     * @returns {string[]}
     */
    getApps: (res) => {

        let randomIndexes = Bronze.prototype.getUniqueRandomNumbers();

        let randomApps = Array.from(randomIndexes).map(randomIndex => {
            return Object.keys(appDetails)[randomIndex];
        });

        return process.env.SERVER_UNDER_UNIT_TEST
            ? randomApps
            : res.send(randomApps);

    }
};

module.exports = Bronze;