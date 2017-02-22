"use strict";

let jwt = require('jsonwebtoken');

module.exports = app => {
    let errorFormatter = app.helpers.errorFormatter;
    let logger = app.helpers.logger;
    let appSecret = app.config.servicesVariables.secret.key;

    function generateToken (payload) {
        return new Promise((resolve, reject) => {
            var token = jwt.sign(payload, appSecret);
            resolve(token);
        });
    }

    function authenticate(token){
        console.log("authenticating");
        return new Promise((resolve,reject)=>{
            jwt.verify(token, appSecret, function(err, decoded) {
              if(err){
                console.log(err);
                return reject(err);
              }
              return resolve(decoded);
            });
        })  
    }

    return {
        generateToken,
        authenticate
    };
};