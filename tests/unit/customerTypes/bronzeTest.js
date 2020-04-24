import test from 'ava';

const {appDetails,getAppsDetailsLength} = require('../../baseUnitTest');
const _ = require('lodash');

const Bronze = require('./../../../lib/rankings/customer_types/bronze');


test("bronze: unit testing getUniqueRandomNumbers", async t => {

    const bronze = Object.create(Bronze.prototype);

    const distinctRandomNumbers =  new Set();

    _.times(100, (i) => {
        let randomResultArr = Array.from(bronze.getUniqueRandomNumbers());
        t.is(randomResultArr.length, 2);
        let firstRandom = randomResultArr[0];
        distinctRandomNumbers.add(firstRandom);

    });

    t.assert(distinctRandomNumbers.size === getAppsDetailsLength());


});