import test from 'ava';
let {appDetails} = require('../../baseUnitTest');
let Gold = require('./../../../lib/rankings/customer_types/gold');



test("gold: unit test the binary search function which returns the closest value to a target value", async t=>{
    console.log("works");
    let gold = Object.create(Gold.prototype);

    let mockArr = [1, 23, 45, 67, 94, 122];

    t.is(gold.getClosestAge(mockArr,96).closestAge,94);
    t.is(gold.getClosestAge(mockArr,47).closestAge,45);
    t.is(gold.getClosestAge(mockArr,207).closestAge,122);
    t.is(gold.getClosestAge(mockArr,0).closestAge,1);
});


// let index = 0;
// console.log(binarySearch([1, 23, 45, 67, 94, 122], 96,index))  //=> 94
// console.log(index);
// console.log(binarySearch([1, 23, 45, 67, 94, 122], 47,index))  //=> 45
// console.log(index);
// console.log(binarySearch([1, 23, 45, 67, 94, 122], 207,index)) //=> 122
// console.log(index);
// console.log(binarySearch([1, 23, 45, 67, 94, 122], 0,index))   //=> 1
// console.log(index);