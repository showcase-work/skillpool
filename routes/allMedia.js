"use strict";

let router = require("express").Router();

module.exports = app => {
    let workController = app.controllers.workController;

    router.route("/").get((req, res, next) => {
        return workController.fetchAllMedia(req, res, next);
    });
    
    return router;
};