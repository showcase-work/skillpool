"use strict";
let request = require("request");
module.exports = app => {
    let errorFormatter = app.helpers.errorFormatter;
    let logger = app.helpers.logger;
    let User = app.models.user;
    let CustomLists = app.models.CustomLists;
    
    function changeProfilePicture (url,userId) {
        return new Promise((resolve,reject)=>{
            User.updateProfilePicture(url,userId).then(result=>{
                return resolve(result);
            })
        })
        
    }

    function getme(id) {
        return new Promise((resolve,reject)=>{
            var checkeduser = null;
            User.getme(id).then(user=>{
                checkeduser = JSON.parse(JSON.stringify(user));
                console.log("trying to fetch lists now");
                return CustomLists.getUserLists(user.id);
            }).then(lists=>{
                    checkeduser.lists = lists;
                    return resolve(checkeduser);
                    //var dataToSend = JSON.parse(JSON.stringify(user));
            }).catch(err=>{
                    return reject(err);
            })
        }) 
    }

    function updatePersonalDetails(params, id, username){
        return new Promise((resolve,reject)=>{
            User.updatePersonalDetails(params, id).then((data)=>{

                if(username != params.username && params.username.trim() != ""){
                    checkUsernameAvailability(params.username).then(isUnique=>{
                        if(isUnique){
                            User.updateUsername(params.username,id).then(data=>{
                                return resolve(data);
                            });
                        }
                        else
                        {
                            return resolve(data);
                        }
                        
                    }).catch(err=>{
                        return resolve(data);
                    })
                }
                else{
                    return resolve(data);
                }

            }).catch(err=>{
                return reject(err);
            })


            
        })
    }

    function updateDepartmentAndSkillsDetails(params, id){
        return new Promise((resolve,reject)=>{
            User.updateDepartmentAndSkillsDetails(params, id).then((data)=>{
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

    function getUserFriends(userId){
        return new Promise((resolve,reject)=>{
            User.getUserFriends(userId).then((data)=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function addCustomList(params, userDetails){
        console.log("jashdhfjksdaf");
        return new Promise((resolve,reject)=>{
            CustomLists.addCustomList(params, userDetails.id).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function checkUsernameAvailability(username){
        return new Promise((resolve,reject)=>{
            User.checkUsernameAvailability(username).then(data=>{
                if(data.length <1){
                    return resolve(true);
                }
                else
                {
                    return reject(false);
                }
            }).catch(err=>{
                console.log(err);
                return reject(err);
            })
        })
    }


    return {
        changeProfilePicture,
        updatePersonalDetails,
        getme,
        updateDepartmentAndSkillsDetails,
        unlinkAccount,
        getUserFriends,
        addCustomList,
        checkUsernameAvailability
    };
};