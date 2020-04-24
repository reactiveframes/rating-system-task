require('dotenv').config();

const createError = require('http-errors'),
    express = require('express'),
    logger = require('morgan'),
    routes = require('./lib/routes'),
    bodyParser = require('body-parser'),
    redis = require(`./lib/orm/redis`),
    //a dedicated integration test is @ tests/integration/multipleClientsInstallApps.js
    app = express();

console.log("Server started, listening on port: " + process.env.PORT);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', routes);


/**
 * Phase 1 of the server's lifecycle.
 * on server start, load the data to in-memory:
 *  - save (m) reads from (n) requests
 *  - when scaling out, every new instance will get updated first before serving (& will communicate with redis channels / kafka - not implement)
 */
redis.init().then()
    .catch(err => {
        console.error(err);
    });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
    console.log(err);
});


process.on('uncaughtException', function (err) {
    console.log(" UNCAUGHT EXCEPTION ");
    console.log("[Inside 'uncaughtException' event] " + err.stack || err.message);
});


module.exports = app;
