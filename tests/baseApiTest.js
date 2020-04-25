require('dotenv').config();
const orm = require('../lib/orm/redis');
delete process.env.SERVER_UNDER_UNIT_TEST;
const server = require('./../app');

const chai = require('chai');
const chaiHttp = require("chai-http");

chai.use(chaiHttp);


module.exports = {
    app: server,
    orm : orm,
    timeout: 10000,
    chai: chai
};