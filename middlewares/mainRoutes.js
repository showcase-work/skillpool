"use strict";

module.exports = app => {
    let userController = app.controllers.userController;
    
    app.use("/api/all-latest-media",app.routes.allMedia);

    app.use("/api/profile-image",app.routes.profileImage);

    app.use("/api/upload",app.routes.uploads);
    app.use("/api/delete",app.routes.delete);
    app.use("/api/update",app.routes.update);
    //app.use("/api/upload/work-blog",app.routes.uploads.workBlog);

    app.use("/api/department-skills",app.routes.departmentAndSkills);

    app.use("/login", app.routes.login);

    app.get("/",userController.authenticateAndAttachUser, (req,res,next) => {
        return res.render("discover/discover", {title:"Skillpool | Discover", user:req.user});
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