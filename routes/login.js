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



    router.route('/local').post(passport.authenticate(
        'local-login', { 
         session: false 
     }),serialize, getToken, respond);

    router.route('/facebook/').get(passport.authenticate('facebook', 
        { 
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
            scope: ['email'],
            failureRedirect: '/',
            session: false,
        }));

    router.route('/twitter').get(passport.authenticate('twitter'));

    router.route('/google').get(passport.authenticate('google', { scope : ['profile', 'email'] }));



    //callbacks
    router.route('/facebook/callback').get(
        userController.authenticateAndAttachUser,
        passport.authenticate('facebook', {
            failureRedirect: '/',
            session: false,
            display: 'popup'
        }),  serialize, getToken, respondAndClose);

    
    router.route('/twitter/callback').get(
        userController.authenticateAndAttachUser,
        passport.authenticate('twitter', {
            failureRedirect : '/',
            session: false
        }),  serialize, getToken, respondAndClose);

    
    router.route('/google/callback').get(
            userController.authenticateAndAttachUser,
            passport.authenticate('google', {
                //successRedirect : '/profile',
                failureRedirect : '/',
                session: false
            }),serialize, getToken, respondAndClose);


    //social connects

    router.route('/connect/facebook').get(passport.authorize('facebook', { scope : 'email' }));
    router.route('/connect/twitter').get(passport.authorize('twitter', { scope : 'email' }));
    router.route('/connect/google').get(passport.authorize('google', { scope : ['profile', 'email'] }));


    router.route('/disconnect/facebook').get(userController.authenticateAndAttachUser,(req,res,next)=>{
        return userController.unlinkAccount(req,res,next,'facebook')
    });
    router.route('/disconnect/twitter').get(userController.authenticateAndAttachUser,(req,res,next)=>{
        return userController.unlinkAccount(req,res,next,'twitter');
    });
    router.route('/disconnect/google').get(userController.authenticateAndAttachUser,(req,res,next)=>{
        return userController.unlinkAccount(req,res,next,'google');
    });
    
    return router;
};


