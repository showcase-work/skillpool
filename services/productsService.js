"use strict";
let request = require("request");

module.exports = app => {
    let errorFormatter = app.helpers.errorFormatter;
    let logger = app.helpers.logger;

    function fetchAllProducts () {
        return new Promise((resolve, reject) => {
            logger.info("fetching all products");
            return request({
                uri: "http://usermanager-query-api-1749316563.ap-southeast-1.elb.amazonaws.com/v1/products",
                method: "GET",
                headers: {
                    "Content-Type":"application/json"
                }
            }, (err, response, body) => {
                if (err || JSON.parse(body).error) {
                    logger.error("error fetching products at fetchAllProducts");
                    let errorObject = errorFormatter.createErrorObject({
                        status: 500,
                        message: "error fetching products at fetchAllProducts"
                    });
                    return reject(errorObject);
                }
                return resolve(body);
            });
        });
    }

    return {
        fetchAllProducts
    };
};