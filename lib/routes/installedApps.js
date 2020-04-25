const express = require('express'),
    router = express.Router(),
    orm = require(`./../orm/redis`);

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
router.post('/', function (req, res) {

    const age = req.query.age;
    const installedApp = req.query.installedApp;

    if (!age || !installedApp)
        res.status(400).send("missing mandatory query parameters: age, and/or installedApp");


    orm.addInstalledApp(installedApp, age, res)
        .then()
        .catch(err => {
            res.status(400);
            console.error(err)
        })

});

module.exports = router;
