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
        userService.updatePersonalDetails(req.body, req.user.id, req.user.username)
        .then(()=>{
            return userService.getme(req.user.id)
        }).then((user)=>{
            res.send(user);
            //return res.render("usersettings/personal", {user:user, tab:'personal'});
        }).catch(err => next(err));
    }

    function updateDepartmentAndSkillsDetails(req,res,next) {
        userService.updateDepartmentAndSkillsDetails(req.body, req.user.id)
        .then((data)=>{
            res.send(data);
        }).catch(err=>{
            next(err);
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

    function getUserFriends(req,res,next){
        userService.getUserFriends(req.user.id).then((data)=>{
            res.send(data);
        }).catch(err=>{
            next(err);
        })
    }

    function addCustomList(req,res,next){
        userService.addCustomList(req.body, req.user).then(data=>{
            res.send(data);
        }).catch(err=>{
            next(err);
        })
    }

    function checkUsernameAvailability(req,res,next){
        if(req.body.username == req.user.username){
            res.send(true);
        }   
        else
        {
            userService.checkUsernameAvailability(req.body.username, req.user.username)
            .then(data=>{
                res.send(data);
            }).catch(err=>{
                next(err);
            })
        }
        
    }

    return {
        authenticateAndAttachUser,
        updatePersonalDetails,
        updateDepartmentAndSkillsDetails,
        unlinkAccount,
        uploadProfileImage,
        uploadAndCropImage,
        getUserFriends,
        addCustomList,
        checkUsernameAvailability
    };
};