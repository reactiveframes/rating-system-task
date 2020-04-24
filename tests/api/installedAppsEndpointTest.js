import test from 'ava';
const {timeout,appDetails,app} = require('../baseApiTest');
const chai = require('chai');
const chaiHttp = require("chai-http");

chai.use(chaiHttp);



test("endpoint: appService/installedApps verifying that the installed app was actually incremented by the age input", async t => {
    t.timeout(timeout);

    appDetails['facebook'].agesInstalled[35] = 0;
    await chai.request(app)
        .post('/appService/installedApps')
        .query({age: 35, installedApp: "facebook"})
        .then(res => {
            chai.expect(res.type).to.equal("text/html");
            chai.expect(res.status).to.equal(200);
            // return res;
            t.assert(true)
        })
        .then(() => {
            t.assert(JSON.parse(appDetails['facebook'].agesInstalled)[35] === 1)
        })
        .catch(err =>{
            console.error(err);
        })

});

