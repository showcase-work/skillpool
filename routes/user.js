"use strict";

let router = require("express").Router();

module.exports = app => {
    let userController = app.controllers.userController;
    

    router.use(userController.authenticateAndAttachUser);

    
    router.route("/friends").get((req, res, next) => {
        return userController.getUserFriends(req,res,next);
    });

    router.route("/customlist/add").post((req,res,next) => {
        return userController.addCustomList(req,res,next);
    })

    router.route("/department-skills").post((req, res, next) => {
        return userController.updateDepartmentAndSkillsDetails(req,res,next);
    });

    router.route("/check-username-availability").post((req,res,next)=>{
        return userController.checkUsernameAvailability(req,res,next);
    })

    router.route("/user-settings").post((req,res,next)=>{
        return userController.updatePersonalDetails(req,res,next);
    })

    
    return router;
};