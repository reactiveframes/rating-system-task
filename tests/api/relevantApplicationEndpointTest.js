import test from 'ava';
const {timeout,appDetails,app} = require('../baseApiTest');

const chai = require('chai');
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

test("endpoint: appService/relevantApplication with category bronze", async t => {
    t.timeout(timeout);

    await chai.request(app)
        .get('/appService/relevantApplication')
        .query({age: 35, category: "social",customerType:"bronze"})
        .then(res => {
            chai.expect(res.type).to.equal("application/json");
            chai.expect(res.status).to.equal(200);
            t.assert(true);
            return res;
        })
        .then(res => {
            assertBusinessLogic(res, t);
        })
        .catch(err =>{
            console.error(err);
        })

});




test("endpoint: appService/relevantApplication with category silver", async t => {
    t.timeout(timeout);

    await chai.request(app)
        .get('/appService/relevantApplication')
        .query({age: 35, category: "social",customerType:"silver"})
        .then(res => {
            chai.expect(res.type).to.equal("application/json");
            chai.expect(res.status).to.equal(200);
            t.assert(true);
            return res;
        })
        .then(res=>{
            assertBusinessLogic(res, t);
        })
        .catch(err =>{
            console.error(err);
        })

});



test("endpoint: appService/relevantApplication with category gold", async t => {
    t.timeout(timeout);

    await chai.request(app)
        .get('/appService/relevantApplication')
        .query({age: 35, category: "social",customerType:"gold"})
        .then(res => {
            chai.expect(res.type).to.equal("application/json");
            chai.expect(res.status).to.equal(200);
            t.assert(true);
            return res;
        })
        .then(res=>{
            assertBusinessLogic(res, t);
        })
        .catch(err =>{
            console.error(err);
        })

});


function assertBusinessLogic(res, t) {
    let appArr = res.body;
    t.assert(Array.isArray(appArr));
    t.assert(appArr.length === parseInt(process.env.NUM_OF_RETURNED_APPS));
    t.assert(appArr[0] !== appArr[1]);
    appArr.forEach(appName => {
        t.assert(appDetails[appName] && appDetails[appName] !== '')
    })
}