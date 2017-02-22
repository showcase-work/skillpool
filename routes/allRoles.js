"use strict";

let router = require("express").Router();

module.exports = app => {
    let rolesController = app.controllers.rolesController;

    router.route("/").get((req, res, next) => {
        return rolesController.fetchAllRoles(req, res, next);
    });
    return router;
};