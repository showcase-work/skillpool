"use strict";

let router = require("express").Router();

module.exports = app => {
    let departmentAndSkillsController = app.controllers.departmentAndSkillsController;

    router.route("/").get((req, res, next) => {
        return departmentAndSkillsController.fetchAllDepartments(req, res, next);
    });
    
    return router;
};