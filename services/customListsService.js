"use strict";

module.exports = app => {
    let CustomLists = app.models.CustomLists;

    function getListsForUser (userId) {        
        return new Promise((resolve,reject)=>{
            CustomLists.getUserLists(user.id).then(lists=>{
                return resolve(lists);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    return {
        getListsForUser,
    };
};