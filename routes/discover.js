"use strict";

let router = require("express").Router();

module.exports = app => {
    let discoverController = app.controllers.discoverController;
    let userController = app.controllers.userController;
    router.use(userController.authenticateAndAttachUser)

    router.route("/fetch-pages-for-discover/").get((req, res, next) => {
        return discoverController.fetchPagesForDiscover(req, res, next);
    });
    
    /*router.route("/").get((req,res,next)=>{
        console.log(req.query);
    })*/


    return router;
};