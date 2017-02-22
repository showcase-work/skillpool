"use strict";
let cloudinary = require('cloudinary');

module.exports = app => {
    let logger = app.helpers.logger;
    let config = app.config.servicesVariables.cloudinary.config;
    cloudinary.config(config);

    function uploadImage(image){
        return new Promise((resolve,reject)=>{
            cloudinary.uploader.upload(image, function(result) { 
                return resolve(result);
            });
        });
    }

    function uploadAndCropImage(imagedata){
        logger.info("uploading image to cloudinary");
        return new Promise((resolve,reject)=>{
            var imagePath = imagedata.path;
            var newwidth = imagedata['newCoordinates[w]'];
            var newheight = imagedata['newCoordinates[h]'];   
            var width = imagedata.width;         
            var height = imagedata.height;         
            var x = imagedata['newCoordinates[x]'];
            var y = imagedata['newCoordinates[y]'];
            cloudinary.uploader.upload(imagePath, function(result) { 
                return resolve(result);
            }, { transformation:[{width:width},{width: newwidth, height: newheight, x: x, y: y, crop: 'crop' }]});

        });
    }

    function uploadMultipleImages(files){
        var c = [];
        var x = null
        var imagePath = null;
        files.forEach(function(image){
            x = new Promise((resolve,reject)=>{
                    imagePath = image.path;
                    cloudinary.uploader.upload(imagePath, function(result) {
                        return resolve(result);
                    });
                })
            c.push(x);
        });
        return new Promise((resolve2, reject2)=>{
            Promise.all(c).then((data)=>{
                return resolve2(data);
            })
        })
        
    }

    return {
        uploadAndCropImage,
        uploadImage,
        uploadMultipleImages
    };
};