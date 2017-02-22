"use strict";
let express = require('express');
let router = express.Router();
let multer = require('multer'); 
let crypto = require('crypto');
let path = require('path')



let storage = multer.diskStorage({
  destination: 'public/images/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

let upload = multer({ storage: storage }).array('photo');

//let upload = multer({dest:'public/images/'});
module.exports = app => {
    let workController = app.controllers.workController;
    let userController = app.controllers.userController;
    let imageService = app.services.cloudinary;

    //router.use(upload.any());

    router.use(function(req,res,next){
      upload(req,res,function(err) {
          console.log("working here");
          if(err) {
              return res.end("Error uploading file.");
          }
          else{
            next();
          }
      });
    });

    router.use(userController.authenticateAndAttachUser)

    router.route("/work-photos").post((req, res, next) => {
      workController.uploadMultipleImages(req, res, next);
    });

    router.route("/work-blog").post((req, res, next) => {
      console.log(req.blog);
      workController.uploadBlog(req, res, next);
    });

    router.route("/work-youtube").post((req, res, next) => {
      workController.uploadYoutube(req, res, next);
    })

    router.route("/images").post((req, res, next) => {
      imageService.uploadMultipleImages(req.files).then(data=>{
        res.send(data);
      })
    });

    router.route("/work-soundcloud").post((req, res, next)=> {
      workController.uploadSoundcloud(req, res, next);
    })



    return router;
};