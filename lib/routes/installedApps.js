const express = require('express');
const router = express.Router();
let {appDetails,addInstalledApp} = require(`./../orm/${process.env.ORM}`);
const orm = require(`./../orm/redis`);

/**
 Query parameters:
 age - integer, user’s age (e.g: 32), required
 installedApp - string, app name installed (e.g. ‘facebook’), required

 Response:
 ● If the message was valid
 status code: 200
 ● If the input is not valid, return a 400 status code (with description)
 ● If the app doesn’t exists, return a 404 status code (with description)

 a dedicated unit test is @ tests/api/installedAppsEndpointTest.js
 */
router.post('/',  function (req, res, next) {

    let age = req.query.age;
    let installedApp = req.query.installedApp;

    if (!age || !installedApp)
        next(new Error("missing mandatory query parameters: age and/or installedApp"));


     orm.addInstalledApp(installedApp, age,res)
         .then()
         .catch(err =>{
             res.status(400);
             console.error(err)
         })

});

module.exports = router;
