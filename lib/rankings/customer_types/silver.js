let {appDetails, getAppsDetailsLength} = require('../../orm/redis');
let fetch = require('node-fetch');
const randomApplicationsCount = process.env.NUM_OF_RETURNED_APPS;


/**
 Same as the Bronze, but having the random number as a response from this API:
 https://www.random.org/integers/?num=1&min=1&max=5&col=1&base=10&format=plain&rnd=new to set the application’s ratings.
 Application rating might change along time…
 */
function Silver() {}


Silver.prototype = {
    /**
     * generating ${randomApplicationsCount} <- env var, random numbers
     * via the given random.org endpoint , using a Set like in bronze to return 2 distinct numbers
     *
     * a dedicated unit test is @ tests/unit/silverTest.js
     * @param res
     */
    getApps :(res) => {

        //the random api generator does not generates distinct numbers & which we need in order to generate random different applications as a response.
        let randomNumbersFromApi = new Promise(async (resolve, reject) => {
            const uniqueRandomNums = new Set();
            while (uniqueRandomNums.size < randomApplicationsCount) {
                let rnd = await Silver.prototype.getRandomNumberFromApi();
                uniqueRandomNums.add(rnd);
            }
            resolve(uniqueRandomNums)
        });

        Promise.resolve(randomNumbersFromApi)
            .then(randomIndexesSet => {
                return Array.from(randomIndexesSet).map(rndIndex => {
                    return Object.keys(appDetails)[rndIndex]
                });
            })
            .then(apps => {
                return process.env.SERVER_UNDER_UNIT_TEST
                    ? apps
                    : res.send(apps);
            })

    },

    getRandomNumberFromApi: async ()=> {
        return await fetch(`https://www.random.org/integers/?num=1&min=0&max=${getAppsDetailsLength() - 1}&col=1&base=10&format=plain&rnd=new`)
            .then(res => {
                return res.text()
            })
            .then(res => {
                //the response text output contains an ending \n ...
                return parseInt(res.replace(/\n$/, ''))
            })
    }
};

module.exports = Silver;