import test from 'ava';
const {getAppsDetailsLength} = require('../../baseUnitTest');
const Silver = require('./../../../lib/rankings/customer_types/silver');


test("silver: unit testing getRandomNumberFromApi", async t => {
    const silver = Object.create(Silver.prototype);

    const distinctRandomNumbers =  new Set();

    const randomApiPromises = [...Array(50)].map(async () => {
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
        .catch(err =>{
            console.error(err);
        })

});