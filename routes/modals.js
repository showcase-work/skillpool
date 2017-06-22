"use strict";

let router = require("express").Router();

module.exports = app => {
    let userController = app.controllers.userController;
    let workController = app.controllers.workController;
    let departmentAndSkillsController = app.controllers.departmentAndSkillsController;

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

    router.route("/preview").get((req, res, next) => {
        console.log("media_id_is"+req.query.media_id);
        workController.getMediaPreview(req, res, next);
    })

    router.route("/add-list").get((req, res, next) => {
        var media={id:req.query.media_id, type:req.query.type};
        console.log(media);
        //console.log("media_id_is"+req.query.media_id);
        return res.render("modals/addList",{media:media})
    })

    router.route("/share-skillpool").get((req, res, next) => {
        var media={id:req.query.media_id, type:req.query.type, media_type:req.query.media_type};
        console.log(media);
        workController.getShareModal(req,res,next);
        return res.render("modals/skillpoolShareModal",{media:media})
    })

    router.route("/complete-profile").get((req, res, next) => {
        console.log(req.user);
        //console.log("media_id_is"+req.query.media_id);
        departmentAndSkillsController.renderCompleteProfile(req,res,next);
        //return res.render("modals/completeProfile",{user:req.user});
    })

    router.route("/add-works").get((req,res,next)=>{
        return res.render("modals/addWorks");
    })

    

  
    return router;
};