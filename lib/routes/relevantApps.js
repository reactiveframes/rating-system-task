const express = require('express'),
    router = express.Router(),
    customerTypes = require('../rankings').customerTypes;

/**
 Query parameters:
 age - integer, user’s age (e.g: 32), required
 Category - string, requested application’s category (e.g:’travel)’, required
 customerType - string, defines rating strategy to be used (e.g: ‘gold’), required

 Response:
 ● If the message was valid
 status code: 200
 body: JSON, object should contain list of applications:
 ● If the input is not valid, return a 400 status code.

 a dedicated unit test is @ tests/api/relevantApplicationEndpointTest.js
 */
router.get('/', function (req, res) {
    const age = req.query.age;
    const category = req.query.category;
    const customerType = req.query.customerType;

    if (!age || !category || !customerType) {
        res.status(400).send("missing mandatory query parameters: age, category and/or customerType");
    }

    //calling the customerTypes object's relevant key e.g. "facebook" to get the relevant customerType object
    //and for future ease of adding more customer types without worrying about infrastructure.
    //the getApps method is only relevant to this endpoint.
    //every customerType must implement this function.
    customerTypes[customerType].getApps(res, age, category);

});

module.exports = router;
