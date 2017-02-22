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

let upload = multer({ storage: storage })

//let upload = multer({dest:'public/images/'});


module.exports = app => {
    let userController = app.controllers.userController;

    router.use(upload.any());

    router.use(userController.authenticateAndAttachUser)

    router.route("/").post((req, res, next) => {
        return userController.uploadProfileImage(req, res, next);
    });

    router.route("/crop").post((req, res, next) => {
        return userController.uploadAndCropImage(req, res, next);
    });
    
    return router;
};