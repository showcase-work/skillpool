"use strict";

module.exports = app => {
    let userService = app.services.userService;
    let tokenService = app.services.tokenService;
    let departmentAndSkillsController = app.controllers.departmentAndSkillsController;
    let imagesService = app.services.cloudinary;

    function authenticateAndAttachUser(req,res,next) {
        if(req.cookies.token && req.cookies.token != undefined){
            tokenService.authenticate(req.cookies.token)
            .then(payload=>{
                return userService.getme(payload.id)
            })
            .then(user => {
                req.user = user;
                next();
            }).catch(err => next(err));
        }
        else
        {
            req.user = null;
            next();
        }
        
    }

    function test(){
        return new Promise((resolve,reject)=>{
            
        })
    }

    function updatePersonalDetails(req,res,next) {
        userService.updatePersonalDetails(req.body, req.user.id)
        .then(()=>{
            return userService.getme(req.user.id)
        }).then((user)=>{
            return res.render("usersettings/personal", {user:user, tab:'personal'});
        }).catch(err => next(err));
    }

    function updateDepartmentAndSkillsDetails(req,res,next) {
        userService.updateDepartmentAndSkillsDetails(req.body, req.user.id)
        .then(()=>{
            return userService.getme(req.user.id)
        }).then((user)=>{
            req.user = user;
            return departmentAndSkillsController.getDepartmentAndRenderPage(req,res,next);
        })
    }

    function unlinkAccount(req,res,next,account){
        var userId = req.user.id;
        userService.unlinkAccount(account,userId).then((data)=>{
            res.send(true);
        })
    }

    function uploadProfileImage(req, res, next) {
            res.send(req.files[0]);
    };
    
    function uploadAndCropImage(req, res, next) {
        var userId = req.user.id;
        imagesService.uploadAndCropImage(req.body).then(result=>{
            return userService.changeProfilePicture(result.url, userId);
        }).then(data=>{
            return userService.getme(userId);
        }).then(user=>{
            res.send("done");
        })
    }

    return {
        authenticateAndAttachUser,
        updatePersonalDetails,
        updateDepartmentAndSkillsDetails,
        unlinkAccount,
        uploadProfileImage,
        uploadAndCropImage
    };
};