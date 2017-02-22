"use strict";
let express = require('express');
let router = express.Router();

//let upload = multer({dest:'public/images/'});
module.exports = app => {
    let workController = app.controllers.workController;
    let userController = app.controllers.userController;
    
    router.use(userController.authenticateAndAttachUser)

    router.route("/work/:id").post((req, res, next) => {
      workController.deleteWork(req,res,next);
    });

    router.route("/media/:id").post((req, res, next) => {
        console.log("wokring in delete route");
      workController.deleteMedia(req,res,next);
    });



    return router;
};