"use strict";
let request = require("request");

module.exports = app => {
    let Skill = app.models.skill
    let Tags = app.models.tags;
    let DataType = app.models.dataType;
    let Department = app.models.department;

    function getAllSkills (query) {
        var object = {

        }
        if(query.department_id){
            object.department_id = query.department_id;
        }
        return new Promise((resolve, reject) => {
            Skill.getSkillsByDepartmentId(object).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        });
    }

    function getAllTags(){
        return new Promise((resolve,reject)=>{
            Tags.getAllTags().then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function getAllDepartments(){
        return new Promise((resolve,reject)=>{
            console.log("in herere?");
            Department.fetchAllDepartments().then(data=>{
                console.log("ajhsdhfdsaf");
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function getAllDataTypes(){
        return new Promise((resolve,reject)=>{
            console.log("in herere2?");

            DataType.getAllDataTypes().then(data=>{
                console.log("ajhsdhfdsaf");
                console.log(data);

                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    return {
        getAllSkills,
        getAllTags,
        getAllDepartments,
        getAllDataTypes
    };
};