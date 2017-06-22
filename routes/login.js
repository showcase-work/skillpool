"use strict";

let router = require("express").Router();

module.exports = app => {
    let userController = app.controllers.userController;
    let tokenService = app.services.tokenService;
    let passport = app.auth.passport;

    function getToken(req, res, next){
        tokenService.generateToken({id:req.user.id, name:req.user.email }).then(token=>{
            var generatedToken = token;
            req.token = generatedToken;
            next();
        });
    }

    function respond(req, res) { 
      res.status(200).json({
        user: req.user,
        token: req.token
      });
    }

    function serialize(req, res, next) {  
      db.updateOrCreate(req.user, function(err, user){
        if(err) {
            return next(err);}
        // we store the updated information in req.user again
        req.user = user;
        next();
      });
    }

    function respondAndClose(req,res,next){
        return res.render("misc/closewindow",{token:req.token});
    }

    const db = {  
      updateOrCreate: function(user, cb){
        cb(null, user);
      }
    };


    router.route('/facebook/').get(passport.authenticate('facebook', 
        { 
            profileFields: ['id', 'email', 'birthday','gender', 'link', 'name', 'displayName','education','hometown','location','work','friends','likes','picture'],
            scope: ['email','user_friends','user_birthday', 'user_work_history','public_profile','user_location','user_hometown','user_education_history', 'user_likes'],
            failureRedirect: '/',
            session: false,
        }));

    //callbacks
    router.route('/facebook/callback').get(
        userController.authenticateAndAttachUser,
        passport.authenticate('facebook', {
            failureRedirect: '/',
            session: false,
            display: 'popup'
        }),  serialize, getToken, respondAndClose);
    
    return router;
};


