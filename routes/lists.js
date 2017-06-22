"use strict";

let router = require("express").Router();

module.exports = app => {
    let listsController = app.controllers.listsController;
    //router.use(userController.authenticateAndAttachUser)

    router.route("/skills").get((req, res, next) => {
        return listsController.getAllSkills(req, res, next);
    });

    router.route("/tags").get((req, res, next) => {
        return listsController.getAllTags(req, res, next);
    });

    router.route("/departments").get((req, res, next) => {
        return listsController.getAllDepartments(req, res, next);
    });

    router.route("/data-types").get((req, res, next) => {
        return listsController.getAllDataTypes(req, res, next);
    });


    return router;
};