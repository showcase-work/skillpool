"use strict";
let request = require("request");
module.exports = app => {
    let errorFormatter = app.helpers.errorFormatter;
    let logger = app.helpers.logger;
    let User = app.models.user;
    
    function changeProfilePicture (url,userId) {
        return new Promise((resolve,reject)=>{
            User.updateProfilePicture(url,userId).then(result=>{
                return resolve(result);
            })
        })
        
    }

    function getme(id) {
        return new Promise((resolve,reject)=>{
            console.log("working in getme");
            User.getme(id).then(user=>{
                console.log("got user");
                return resolve(user);
            });
        }) 
    }

    function updatePersonalDetails(params, id){
        return new Promise((resolve,reject)=>{
            User.updatePersonalDetails(params, id).then((data)=>{
                return resolve(data);
            });
        })
    }

    function updateDepartmentAndSkillsDetails(params, id){
        return new Promise((resolve,reject)=>{
            User.updateDepartmentAndSkillsDetails(params, id).then((data)=>{
                var c = (params.departments).toString();
                return resolve(data);
            })
        })
    }

    function unlinkAccount(account,id){
        return new Promise((resolve,reject)=>{
            User.unlinkAccount(account, id).then((data)=>{
                return resolve(data);
            })
        })
    }


    return {
        changeProfilePicture,
        updatePersonalDetails,
        getme,
        updateDepartmentAndSkillsDetails,
        unlinkAccount
    };
};