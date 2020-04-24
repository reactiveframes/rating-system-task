var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Mock ranking rest server")
});

router.use('/appService/relevantApplication', require('./relevantApps'));
router.use('/appService/installedApps', require('./installedApps'));

module.exports = router;
