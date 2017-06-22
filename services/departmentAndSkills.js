"use strict";

module.exports = app => {
    let Department = app.models.department;
    function fetchAllDepartments () {        
        return new Promise((resolve,reject)=>{

            Department.fetchAllDepartments().then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    return {
        fetchAllDepartments,
    };
};