var express = require('express');
var router = express.Router();

const customerTypes = require('../rankings').customerTypes;

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
 */
router.get('/',  function(req, res, next) {
  let age = req.query.age;
  let category = req.query.category;
  let customerType = req.query.customerType;

  if(!age || !category || !customerType) {
    res.status(404).send("missing mandatory query parameters: age, category and/or customerType");
  }

  customerTypes[customerType].getApps(res,age,category);

});

module.exports = router;
