const fs = require("fs");
const path = require('path');

/**
 * A mechanism for implicitly loading all js files from a certain folder into a single object
 * in this case the ranking/customer_types
 * this is for ease of extending the customer types.
 * @param source
 * @param obj
 * @returns {string}
 */
const requireJSFile = (source, obj) => fs.readdirSync(path.resolve(__dirname, source)) // read folder contents
    .filter(f => /\.js$/.test(f))  // weed out all but JS files
    .reduce((p, c) => {
        let customerType = require(path.join(path.resolve(__dirname, source), c));
        obj[c.replace(".js", "")] = Object.create(customerType.prototype);//Object.create(customerType.prototype);
    }, obj);// extend obj such that obj[customerType name] = require(customer type file)


module.exports = {
    customerTypes: (() => {
        let customerTypes = {};
        requireJSFile("./customer_types", customerTypes);
        return customerTypes;
    })()
};