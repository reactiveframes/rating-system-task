import test from 'ava';
const {appDetails} = require('../../baseUnitTest');
const Gold = require('./../../../lib/rankings/customer_types/gold');



test("gold: unit test the binary search function which returns the closest value to a target value", async t=>{
    console.log("works");
    let gold = Object.create(Gold.prototype);

    let mockArr = [1, 23, 45, 67, 94, 122];

    t.is(gold.getClosestAge(mockArr,96).closestAge,94);
    t.is(gold.getClosestAge(mockArr,47).closestAge,45);
    t.is(gold.getClosestAge(mockArr,207).closestAge,122);
    t.is(gold.getClosestAge(mockArr,0).closestAge,1);
});
