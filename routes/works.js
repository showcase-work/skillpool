"use strict";

let router = require("express").Router();
module.exports = app => {
    let userController = app.controllers.userController;
    let workController = app.controllers.workController;
    let departmentAndSkillsService = app.services.departmentAndSkills;


    router.use(userController.authenticateAndAttachUser);

    router.route("/add-work").get((req,res,next) => {
        departmentAndSkillsService.fetchAllDepartments().then((data)=>{
            return res.render("works/addwork", {user:req.user, tab:'works', departments:data});
        })
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

    /*social media*/

    router.route("/media/like/add").post((req,res,next) => {
        return workController.likeMedia(req,res,next);
    })

    router.route("/media/like/delete").post((req,res,next) => {
        return workController.unlikeMedia(req,res,next);
    })

    router.route("/media/comment/add").post((req,res,next) => {
        return workController.commentOnMedia(req,res,next);
    })

    router.route("/media/comment/delete").post((req,res,next) => {
        return workController.deleteCommentFromMedia(req,res,next);
    })

    router.route("/media/favorite/add").post((req,res,next) => {
        return workController.addToFavoriteListForMedia(req,res,next);
    })

    router.route("/media/favorite/delete").post((req,res,next) => {
        return workController.deleteFromFavoriteListForMedia(req,res,next);
    })


    return router;
};