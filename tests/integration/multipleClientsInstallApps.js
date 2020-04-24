import test from 'ava';

const {timeout, appDetails, app} = require('../baseApiTest');
const chai = require('chai');
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const clientsInstallations = [
    {age: 25, installedApp: "facebook"},
    {age: 26, installedApp: "facebook"},
    {age: 26, installedApp: "facebook"},
    {age: 34, installedApp: "facebook"},
    {age: 35, installedApp: "facebook"},
    {age: 27, installedApp: "facebook"},
    {age: 27, installedApp: "facebook"},
    {age: 27, installedApp: "facebook"},
    {age: 25, installedApp: "facebook"},
    {age: 26, installedApp: "facebook"},
    {age: 26, installedApp: "facebook"},
    {age: 34, installedApp: "facebook"},
    {age: 35, installedApp: "facebook"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"},
    {age: 25, installedApp: "facebook"},
    {age: 26, installedApp: "facebook"},
    {age: 26, installedApp: "facebook"},
    {age: 34, installedApp: "instagram"},
    {age: 35, installedApp: "instagram"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"},
    {age: 27, installedApp: "whatsup"}
];


const relevantAppRequest = {
    age: 26,
    category: "social",
    customerType: "gold"
};


/**
 * This test demonstrates the rating system by raising up the frequency of facebook and whatsup installations
 * Once a user requests to get a relevant app by his age category , of course using the customerType=gold
 * he is supposed to get facebook and whatsup.
 */
test("integration: multiple clients install apps and get different ratings", async t => {
    t.timeout(timeout);

    const requester = chai.request(app).keepOpen();

    const requests = clientsInstallations.map(req => {
        return requester.post(`/appService/installedApps?age=${req.age}&installedApp=${req.installedApp}`)
    });

    const req = requester.get(`/appService/relevantApplication?age=${relevantAppRequest.age}&category=${relevantAppRequest.category}&customerType=${relevantAppRequest.customerType}`)

    await Promise.all(requests)
        .then(responses => {
            return responses;
        })
        .then(res => Promise.resolve(req))
        .then(res => {
            const appsResult = res.body;
            console.log("integration result: "+appsResult);
            t.assert(appsResult.indexOf("facebook") > -1);
            t.assert(appsResult.indexOf("whatsup") > -1);
        })
        .then(res => requester.close())
        .then(res => t.assert(true))
        .catch(err =>{
            console.error(err);
        })

});



