import test from 'ava';

let {appDetails,getAppsDetailsLength} = require('../../baseUnitTest');
let _ = require('lodash');

let Bronze = require('./../../../lib/rankings/customer_types/bronze');


test("bronze: unit testing getUniqueRandomNumbers", async t => {

    let bronze = Object.create(Bronze.prototype);

    let distinctRandomNumbers =  new Set();

    _.times(100, (i) => {
        let randomResultArr = Array.from(bronze.getUniqueRandomNumbers());
        t.is(randomResultArr.length, 2);
        let firstRandom = randomResultArr[0];
        distinctRandomNumbers.add(firstRandom);

    });

    t.assert(distinctRandomNumbers.size === getAppsDetailsLength());


});