import test from 'ava';

let {getAppsDetailsLength} = require('../../baseUnitTest');

let Silver = require('./../../../lib/rankings/customer_types/silver');


test("silver: unit testing getRandomNumberFromApi", async t => {
    let silver = Object.create(Silver.prototype);

    let distinctRandomNumbers =  new Set();

    let randomApiPromises = [...Array(50)].map(async () => {
        return new Promise(async (resolve, reject) => {
            let randomNum = await silver.getRandomNumberFromApi();
            distinctRandomNumbers.add(randomNum);

            resolve(randomNum)
        });
    });

    await Promise.all(randomApiPromises)
        .then(()=>{
            t.assert(distinctRandomNumbers.size === getAppsDetailsLength());
        })

});