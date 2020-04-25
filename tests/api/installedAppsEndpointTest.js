import test from 'ava';
const {chai,timeout,orm,app} = require('../baseApiTest');


test("endpoint: appService/installedApps verifying that the installed app was actually incremented by the age input", async t => {
    t.timeout(timeout);

    t.assert(orm.appDetails['facebook'].agesInstalled[18] ===  17);
    await chai.request(app)
        .post('/appService/installedApps')
        .query({age: 18, installedApp: "facebook"})
        .then(res => {
            chai.expect(res.type).to.equal("text/html");
            chai.expect(res.status).to.equal(200);
            // return res;
            t.assert(true)
        })
        .then(() => {
            t.assert(JSON.parse(orm.appDetails['facebook'].agesInstalled)[18] === 18)
        })
        .catch(err =>{
            console.error(err);
        })

});

