"use strict";

let router = require("express").Router();
module.exports = app => {
    let userController = app.controllers.userController;
    let workController = app.controllers.workController;

    router.use(userController.authenticateAndAttachUser);

    router.route("/add-work").get((req,res,next) => {
        return res.render("works/addwork", {user:req.user, tab:'works'});
    })

    router.route("/add-work").post((req,res,next) => {
        return workController.addWork(req, res, next);
    })

    router.route("/edit-work").get((req,res,next) => {
        return workController.getWorkEditPage(req,res,next);
    })

    router.route("/edit-work").post((req,res,next) => {
        return workController.updateWork(req,res,next);
    })

    router.route("/media").post((req,res,next) => {
        return workController.updateMedia(req,res,next);
    })

    router.route("/:id").get((req,res,next) => {
        console.log(req.params.id);
        workController.renderProjectPreviewPage(req,res,next);
        //res.render("works/preview", {title:"Skillpool | Discover", user:req.user, tab:'works'});
    })

    return router;
};