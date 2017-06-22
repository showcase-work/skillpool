"use strict";

let router = require("express").Router();

module.exports = app => {
    let discoverController = app.controllers.discoverController;
    let userController = app.controllers.userController;
    let departmentAndSkillsService = app.services.departmentAndSkills;


    router.use(userController.authenticateAndAttachUser)

    router.route("/fetch-pages-for-discover/").get((req, res, next) => {
        return discoverController.fetchPagesForDiscover(req, res, next);
    });

    router.route("/").get((req,res,next)=>{
        departmentAndSkillsService.fetchAllDepartments().then(data=>{
        console.log(data);
        return res.render("discover/discover", {title:"Skillpool | Discover", user:req.user, departments:data });

        })
        //res.send({title:"Skillpool | Discover", user:req.user, query:req.query });
    })
    
    /*router.route("/").get((req,res,next)=>{
        console.log(req.query);
    })*/


    return router;
};