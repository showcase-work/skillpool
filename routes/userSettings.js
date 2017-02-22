"use strict";

let router = require("express").Router();

module.exports = app => {
    let userController = app.controllers.userController;
    let departmentAndSkillsController = app.controllers.departmentAndSkillsController;
    let workController = app.controllers.workController;

    router.use(userController.authenticateAndAttachUser);

    router.route("/").get((req, res, next) => {
        return res.render("usersettings/personal", {user:req.user, tab:'personal'});
    });

    router.route("/picture").get((req,res,next) => {
        return res.render("usersettings/picture", {user:req.user, tab:'picture'});
    })

    router.route("/department-skills").get((req,res,next) => {
        return departmentAndSkillsController.getDepartmentAndRenderPage(req,res,next);
    })

    router.route("/social").get((req,res,next) => {
        return res.render("usersettings/social", {user:req.user, tab:'social'});
    })

    router.route("/works").get((req,res,next) => {
        workController.getAllWorksByUserId(req,res,next);
    })

    router.route("/account").get((req,res,next) => {
        return res.render("usersettings/department", {user:req.user, tab:'department'});
    })

    router.route("/").post((req, res, next) => {
        return userController.updatePersonalDetails(req,res,next);
    });

    router.route("/department-skills").post((req,res,next) => {
        return userController.updateDepartmentAndSkillsDetails(req,res,next);
    })

    
    return router;
};