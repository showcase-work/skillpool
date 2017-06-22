"use strict";

let SC = require('node-soundcloud');

module.exports = app => {
    let userController = app.controllers.userController;
    
    app.use("/api/all-latest-media",app.routes.allMedia);

    app.use("/api/profile-image",app.routes.profileImage);

    app.use("/api/upload",app.routes.uploads);
    app.use("/api/delete",app.routes.delete);
    app.use("/api/update",app.routes.update);
    app.use("/api/user",app.routes.user);
    app.use("/api/lists", app.routes.lists);
    
    //app.use("/api/upload/work-blog",app.routes.uploads.workBlog);

    app.use("/api/department-skills",app.routes.departmentAndSkills);
    app.get("/api/connect/soundcloud", function(req,res,next){
        SC.init({
          id: 'CPSqag9v4AjPEWtCkqjQEd8oyuw0YKeo',
          secret: 'cLcZKThCE1azIxFJLa84PAuwjGk6u5xT',
          uri: '/api/soundcloudredirect'
        });

        var initOAuth = function(req, res) {
          var url = SC.getConnectUrl();
          console.log("working here");
          console.log(url);
          res.writeHead(301, { location: url });
          res.end();
        };
    });


    app.get("/api/soundcloudredirect", function(req,res,next){
        console.log(req.query);
        console.log(code);
        console.log(req);

        SC.authorize(code, function(err, accessToken) {
            if ( err ) {
              throw err;
            } else {
              // Client is now authorized and able to make API calls
              console.log('access token:', accessToken);
            }
        });
    })

    app.use("/login", app.routes.login);

    /*app.get("/",userController.authenticateAndAttachUser, (req,res,next) => {
        return res.redirect("/discover/");
        return res.render("discover/discover", {title:"Skillpool | Discover", user:req.user});
    })*/

    app.get("/", (req,res,next)=>{
        return res.redirect("/discover/");
    })

    app.use("/user-settings", app.routes.userSettings);
    app.use("/works", app.routes.works);

    app.use("/modals", app.routes.modals);



    app.get('/logout', function(req,res,next){
        res.clearCookie("user");
        res.clearCookie("token");
        res.redirect('/');
    })


    app.use("/discover", app.routes.discover);

    app.post("/discover/fetch-pages-for-discover", (req,res,next)=>{
        return res.render("discover/fetch-pages-for-discover",{media:"test"});
    })
    
};