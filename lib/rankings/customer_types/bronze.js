const {appDetails, getAppsDetailsLength} = require('./../../orm/redis');
const randomApplicationsCount = process.env.NUM_OF_RETURNED_APPS;
/**
 Ranking service will return 2 apps randomly
 */
function Bronze(options) {
}


Bronze.prototype ={

    getUniqueRandomNumbers: () => {
        //using a hashset to get distinct random numbers
        const uniqueRandomNums = new Set();
        while(uniqueRandomNums.size < randomApplicationsCount) {
            uniqueRandomNums.add(Math.floor(Math.random() * getAppsDetailsLength()));
        }
        return uniqueRandomNums
    },
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

// function getUniqueRandomNumbers(){
//     //using a hashset to get distinct random numbers
//     const uniqueRandomNums = new Set();
//     while(uniqueRandomNums.size < randomApplicationsCount)
//         uniqueRandomNums.add(Math.floor(Math.random() * getAppsDetailsLength()));
//     return uniqueRandomNums
// }

module.exports = Bronze;