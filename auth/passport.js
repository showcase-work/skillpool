"use strict";

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let sequelize = require('sequelize');

module.exports = app => {

    let User = app.models.user.User;
    let configAuth = app.config.auth;

    var emailid = 0;
    var photo = null;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
            console.log("working in serilize");
            done(null, user);
        });

    passport.deserializeUser(function(user, done) {
        console.log("working in deserilize1");
        User.findById(user.id).then(user=>{
            console.log("working in deserilize2");
            done(null, user);
        }).catch(err=>{
            done(err, null);
        }) 
    });

// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists

            console.log("checking for user")
            if(!req.user){
                User.find({ where: {email: email} }).then(function(user) {

                    if (user) {
                        var test = user.validPassword(password);
                        if(test){
                            user.password = undefined;
                            return done(null, user);
                        }
                        return done(null, false);
                        
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = User.build({email:email, password:password});

                        // save the user
                        newUser.save().then(()=>{
                            delete newUser.password;
                            return done(null, newUser);
                        }).catch((err)=>{
                            throw err;
                        });
                    }

                });
            }
            else
            {   
                var userId = req.user.id;

                User.update(
                {
                    email: email,
                    password:password
                },
                {
                    where: { 
                        id:userId
                    }
                }
                ).then(function(){
                    console.log("updated successfully");
                    return done(null, user);
                }).catch(function(e){
                    console.log("updating faile"+e);
                    return done(err);
                })
            }

        });

    }));








    passport.use(new FacebookStrategy({
            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            passReqToCallback : true,
            profileFields: ['id', 'email', 'birthday','gender', 'link', 'name', 'displayName','education','hometown','location','work','friends','likes','picture'],
            scope: ['email','user_friends','user_birthday', 'user_work_history','public_profile','user_location','user_hometown','user_education_history','user_likes']
        },
        // facebook will send back the token and profile
        function(req, token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function() {
                // find the user in the database based on their facebook id
                if(profile.emails != undefined){
                    emailid = profile.emails[0].value;
                }
                if(profile.photos && profile.photos.length>0){
                    photo = profile.photos[0].value;
                }

                console.log("checking for user")

                if(!req.user){
                    User.find({
                      where: {
                        $or: [
                            sequelize.where(sequelize.literal('facebook->"$.id"'),profile.id),
                            sequelize.where(sequelize.literal('email'),emailid)
                            ]
                      }
                    }).then(user=>{
                        if (user) {
                            console.log("working in building if user exists")
                            console.log(profile);
                            User.update(
                            {
                                facebook: profile._json
                            },
                            {
                                where: { 
                                    id:user['id']
                                }
                            }
                            ).then(function(){
                                console.log("updated successfully");
                                return done(null, user);
                            }).catch(function(e){
                                console.log("updating faile"+e);
                                return done(err);
                            })
                        } else {
                            // if there is no user found with that facebook id, create them
                            var name = profile.name.givenName + ' ' + profile.name.familyName;
                            var newUser = User.build({
                              name: profile.displayName,
                              email: emailid,
                              role: 'user',
                              image: profile.picture,
                              gender:profile.gender,
                              facebook: profile._json,
                            });

                            newUser.save()
                            .then(user => {
                                done(null, user)
                            })
                            .catch(err => {
                                done(err)
                            });
                        }

                    }).catch(err=>{
                        console.log(err);
                        return done(err);
                    })
                }
                else
                {   
                    console.log("profile updating");
                    var userId = req.user.id;

                    User.update(
                    {
                        facebook: profile._json
                    },
                    {
                        where: { 
                            id:userId
                        }
                    }
                    ).then(function(updateduser){
                        console.log("updated successfully");
                        return done(null, updateduser);
                    }).catch(function(e){
                        console.log("updating faile"+e);
                        return done(e);
                    })
                }

            });
        }
    ));




    passport.use(new TwitterStrategy({

            consumerKey     : configAuth.twitterAuth.consumerKey,
            consumerSecret  : configAuth.twitterAuth.consumerSecret,
            callbackURL     : configAuth.twitterAuth.callbackURL,
            passReqToCallback : true

        },
        function(req, token, tokenSecret, profile, done) {

            if(profile.emails != undefined){
                emailid = profile.emails[0].value;
            }
            if(profile.photos && profile.photos.length>0){
                photo = profile.photos[0].value.replace("_normal","");
            }

            // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function() {

                if(!req.user){

                    User.find({
                      where: {
                        $or: [
                            sequelize.where(sequelize.literal('twitter->"$.id"'),profile.id),
                            sequelize.where(sequelize.literal('email'),emailid)
                            ]
                      }
                    }).then(user=>{
                        if (user) {
                            console.log("working in building if user exists")
                            if(user.twitter != null){
                                return done(null, user);
                            }   
                            else
                            {
                                User.update(
                                {
                                    twitter: profile._json
                                },
                                {
                                    where: { 
                                        id:user['id']
                                    }
                                }
                                ).then(function(){
                                    console.log("updated successfully");
                                    return done(null, user);
                                }).catch(function(e){
                                    console.log("updating faile"+e);
                                    return done(e);
                                })
                            }
                        } else {
                            // if there is no user found with that facebook id, create them
                            //var name = profile.name.givenName + ' ' + profile.name.familyName;
                            var newUser = User.build({
                              name: profile.displayName,
                              email: emailid,
                              role: 'user',
                              image: photo,
                              gender: profile.gender,
                              twitter: profile._json,
                            });

                            newUser.save()
                            .then(user => {
                                done(null, user)
                            })
                            .catch(err => {
                                console.log(err);
                                done(err)
                            });
                        }

                    }).catch(err=>{
                        return done(err);
                    });
                }
                else
                {   
                    var userId = req.user.id;

                    User.update(
                    {
                        twitter: profile._json
                    },
                    {
                        where: { 
                            id:userId
                        }
                    }
                    ).then(function(updateduser){
                        console.log("updated successfully");
                        return done(null, updateduser);
                    }).catch(function(e){
                        console.log("updating faile"+e);
                        return done(e);
                    })
                }

            });
        }
    ));















    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,
            passReqToCallback : true

        },
        function(req, token, refreshToken, profile, done) {
            
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {
                
                if(profile.emails != undefined){
                    emailid = profile.emails[0].value;
                }
                if(profile.photos != undefined && profile.photos.length>0){
                    photo = profile.photos[0].value.replace("sz=50","");
                }
                
                if(!req.user){
                    User.find({
                      where: {
                        $or: [
                            sequelize.where(sequelize.literal('google->"$.id"'),profile.id),
                            sequelize.where(sequelize.literal('email'),emailid)
                            ]
                      }
                    }).then(user=>{
                        if (user) {
                            console.log("working in building if user exists")
                            if(user.google != null){
                                return done(null, user);
                            }   
                            else
                            {
                                User.update(
                                {
                                    google: profile._json
                                },
                                {
                                    where: { 
                                        id:user['id']
                                    }
                                }
                                ).then(function(){
                                    console.log("updated successfully");
                                    return done(null, user);
                                }).catch(function(e){
                                    console.log("updating faile"+e);
                                    return done(e);
                                })
                            }
                        } else {
                            // if there is no user found with that facebook id, create them
                            //var name = profile.name.givenName + ' ' + profile.name.familyName;
                            var newUser = User.build({
                              name: profile.displayName,
                              email: emailid,
                              role: 'user',
                              image: photo,
                              google: profile._json,
                              gender: profile.gender
                            });

                            newUser.save()
                            .then(user => {
                                done(null, user)
                            })
                            .catch(err => {
                                console.log(err);
                                done(err)
                            });
                        }

                    }).catch(err=>{
                        console.log(err);
                        return done(err);
                    });
                }
                else
                {   
                    var userId = req.user.id;

                    User.update(
                    {
                        google: profile._json
                    },
                    {
                        where: { 
                            id:userId
                        }
                    }
                    ).then(function(updateduser){
                        console.log("updated successfully");
                        return done(null, updateduser);
                    }).catch(function(e){
                        console.log("updating faile"+e);
                        return done(e);
                    })
                }
                

            });

        }));

    return passport;
}
