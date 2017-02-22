"use strict";
let express = require('express');
let router = express.Router();

//let upload = multer({dest:'public/images/'});
module.exports = app => {
    let workController = app.controllers.workController;
    let userController = app.controllers.userController;
  
    router.use(userController.authenticateAndAttachUser)

    router.route("/workCover").post((req, res, next) => {
        workController.updateWorkCover(req, res, next);
    });

    router.route("/work-blog").post((req,res,next) => {
        workController.updateMediaBlog(req,res,next);
    })

    return router;
};