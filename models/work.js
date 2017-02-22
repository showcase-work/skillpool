"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;


    var Work = sequelize.define("Work", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: Sequelize.INTEGER,
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        type: Sequelize.STRING,
        role: Sequelize.STRING,
        tags: Sequelize.STRING,
        tools: Sequelize.STRING,
        cover: Sequelize.STRING,
        skills_used: Sequelize.STRING,
        main_link: Sequelize.STRING,

    },
        {
            tableName: "user_works",
            timestamps: false
        }
    );

    function addWork(params,id){

        return new Promise((resolve,reject)=>{

            var newWork = Work.build({
              title: params.title,
              description: params.description,
              user_id: id,
              type: params.type,
              role: params.role,
              main_link: params.link,
              tags: params.tags,
              tools: params.tools,
              skills_used: params.skills,
            });

            newWork.save()
            .then(work => {
                return resolve(work);
            })
            .catch(err => {
                return reject(err);
            });
        })
        
    }

    function updateWork(params,id){
        console.log("upating work");
        return new Promise((resolve,reject)=>{
            Work.update(
            {
                title: params.title,
                description: params.description,
                user_id: id,
                type: params.type,
                role: params.role,
                main_link: params.link,
                tags: params.tags,
                tools: params.tools,
                skills_used: params.skills,
            },
            {
                where: { 
                    id:params.projectId,
                    user_id:id
                }
            }
            ).then(function(data){
                console.log("updated successfully");
                return resolve(data);
            }).catch(function(e){
                console.log("updating faile"+e);
                return reject(e);
            })
        })
    }

    function getWorkById(id){
        console.log("getting work by id");
        return new Promise((resolve,reject)=>{
            Work.findById(id).then(work=>{
                return resolve(work);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function getAllWorksByUserId(id){
        console.log("getting works by userid");
        return new Promise((resolve,reject)=>{
            Work.findAll({
                where:{
                    user_id:id
                }
            }).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        });
    }

    function deleteWork(id, userId){
        console.log("working in delete work model");
        return new Promise((resolve, reject)=>{
            Work.destroy({
                where: {
                    id:id,
                    user_id:userId
                }
            }).then(data=>{
                console.log("herere");
                console.log(data);
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function updateWorkCover(userId, workId, coverId){
        return new Promise((resolve,reject)=>{
            Work.update(
            {
                cover: coverId,
            },
            {
                where: { 
                    id:workId,
                    user_id:userId
                }
            }
            ).then(function(data){
                console.log("updated successfully");
                return resolve(data);
            }).catch(function(e){
                console.log("updating faile"+e);
                return reject(e);
            })
        })
    }

    return {
        Work,
        addWork,
        updateWork,
        getWorkById,
        getAllWorksByUserId,
        deleteWork,
        updateWorkCover
    };
};
