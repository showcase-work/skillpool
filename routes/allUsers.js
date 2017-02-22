"use strict";

let router = require("express").Router();

module.exports = app => {
    let usersController = app.controllers.usersController;

    router.route("/").get((req, res, next) => {
        return usersController.fetchAllUsers(req, res, next);
    });
    
    return router;
};