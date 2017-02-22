"use strict";

let router = require("express").Router();

module.exports = app => {
    let userController = app.controllers.userController;
    let workController = app.controllers.workController;

    router.use(userController.authenticateAndAttachUser);

    router.route("/blog").get((req, res, next) => {
        console.log("project_id_is"+req.query.projectId);
        return res.render("modals/blog", {user:req.user, tab:'works', projectId:req.query.projectId}); 
        
    });

    router.route("/editblog").get((req, res, next) => {
        workController.getMediaAndRenderBlog(req,res,next);
    })

    router.route("/picture").get((req, res, next) => {
        console.log("project_id_is"+req.query.projectId);
        return res.render("modals/picture", {user:req.user, tab:'works', projectId:req.query.projectId});
    });

    router.route("/audio").get((req, res, next) => {
        console.log("project_id_is"+req.query.projectId);
        return res.render("modals/audio", {user:req.user, tab:'works', projectId:req.query.projectId});
    });

    router.route("/video").get((req, res, next) => {
        console.log("project_id_is"+req.query.projectId);
        return res.render("modals/video", {user:req.user, tab:'works', projectId:req.query.projectId});
    });

  
    return router;
};