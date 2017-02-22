"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;
    let User = app.models.user.User;
    let Like = app.models.like.Like;
    let Work = app.models.work.Work;

    var Media = sequelize.define("Media", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        work_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        media_type: Sequelize.STRING,
        link: Sequelize.STRING,
        position: Sequelize.INTEGER,
        tags: Sequelize.STRING,
        description: Sequelize.STRING,
        work_department: Sequelize.STRING,
        skills_used: Sequelize.STRING,
        blog: Sequelize.TEXT
    },
        {
            tableName: "user_works_media",
            timestamps: false
        }
    );

    Media.belongsTo(User,{foreignKey:"user_id"});
    Media.belongsTo(Work,{foreignKey:"work_id"});

    function getLatestMedia(params){
        return new Promise((resolve, reject) => {
            Media.findAll({
                raw: true,
                include: [{model: User},{model: Work}],
                order:'id DESC',
                where:{
                    $and: [
                        {
                            '$Work.type$': [
                                'music2', 'music'
                            ]
                        },
                        /*{
                            '$Work.skills_used$': [
                                'learn'
                            ]
                        },*/
                        {
                            'media_type': [
                                'image'
                            ]
                        }

                    ]
                }
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching Media - Sequelize",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function fetchAllMediaDetailsByProjectId(projectId){
        return new Promise((resolve, reject) => {
            Media.findAll({
                raw: true,
                include: [{model: User},{model: Work}],
                where:{work_id:projectId},
                order:'id DESC'
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching Media - Sequelize",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function uploadImages(objects, workId){
        return new Promise((resolve,reject)=>{
            Media.bulkCreate(objects).then(media=>{
                return resolve(true);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function uploadBlog(object, workId){
        return new Promise((resolve,reject)=>{
            var newMedia = Media.build(object);
            newMedia.save()
            .then(media => {
                console.log("workig and saving in media blog");
                console.log(media);
                return resolve(media);
            })
            .catch(err => {
                return reject(err);
            });
        })
    }

    function uploadYoutube(object, workId){
        return new Promise((resolve,reject)=>{
            var newMedia = Media.build(object);
            newMedia.save()
            .then(media => {
                console.log("workig and saving in media youtube");
                console.log(media);
                return resolve(media);
            })
            .catch(err => {
                return reject(err);
            });
        })
    }

    function getAllMediaForProject(projectId){
        return new Promise((resolve,reject)=>{
            console.log("working in get all media");
            Media.findAll({
                where:{
                    work_id:projectId
                },
                order:'position'
            }).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function updateMedia(parmas, id, userId){
        return new Promise((resolve,reject)=>{
            Media.update(
            parmas,
            {
                where: { 
                    id:id,
                    user_id:userId
                }
            }
            ).then(function(data){
                console.log("updated successfully");
                return resolve(true);
            }).catch(function(e){
                console.log("updating faile"+e);
                return reject(e);
            })
        })
    }

    function getMediaById(id){
        return new Promise((resolve,reject)=>{
            Media.findById(id).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function deleteMediaByWorkId(projectId, userId){
        console.log("deleting media");
        return new Promise((resolve, reject)=>{
            Media.destroy({
                where: {
                    work_id:projectId,
                    user_id:userId
                }
            }).then(data=>{
                console.log("deleted media");
                console.log(data);
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function uploadSoundcloud(object, workId){
        return new Promise((resolve,reject)=>{
            var newMedia = Media.build(object);
            newMedia.save()
            .then(media => {
                console.log("workig and saving in media soundcloud");
                console.log(media);
                return resolve(media);
            })
            .catch(err => {
                return reject(err);
            });
        })
    }

    function getMediaByUserIdProjectIdAndMediaId(userId, projectId, mediaId){
        return new Promise((resolve,reject)=>{
            console.log("working in get media");
            Media.findAll({
                where:{
                    work_id:projectId,
                    id:mediaId,
                    user_id:userId
                }
            }).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function updateMediaBlog(userId,projectId,mediaId,blog){
        return new Promise((resolve,reject)=>{
            Media.update(
                {
                    blog:blog
                },
                {
                    where: { 
                        id:mediaId,
                        work_id:projectId,
                        user_id:userId
                    }
                }
            ).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function deleteMediaById(mediaId, userId){
        return Media.destroy({
            where:{
                id:mediaId,
                user_id:userId
            }
        })
    }

    return {
        getLatestMedia,
        uploadImages,
        getAllMediaForProject,
        updateMedia,
        uploadBlog,
        getMediaById,
        deleteMediaByWorkId,
        uploadYoutube,
        uploadSoundcloud,
        getMediaByUserIdProjectIdAndMediaId,
        updateMediaBlog,
        fetchAllMediaDetailsByProjectId,
        deleteMediaById
    };
};
