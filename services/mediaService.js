"use strict";
let request = require("request");
let Sequelize = require("sequelize");


module.exports = app => {
    let errorFormatter = app.helpers.errorFormatter;
    let logger = app.helpers.logger;
    let Media = app.models.media;
    let Like = app.models.like;
    let Comment = app.models.comment;
    let List = app.models.List;

    function fetchAllMedia (params, userDetails) {
        var filters = {}
        console.log("params are");
        console.log(params);
        if(params.dept_filters){
            filters['$Work.type$'] = params.dept_filters;
        }
        if(params.genre_filters){
            var new_genre_filters = params.genre_filters.join("|");
            filters.tags = Sequelize.literal('`Media`.`tags` REGEXP "'+new_genre_filters+'" ');
        }
        if(params.skills_filters){
            var new_skills_filters = params.skills_filters.join("|")
            filters['$Work.skills_used$'] = Sequelize.literal('`Work`.`skills_used` REGEXP "'+new_skills_filters+'" ');
        }
        if(params.type_filters){
            filters.media_type = params.type_filters;
        }

        var length = 0;
        var LikesPromise;
        var CommentsPromise;
        var noOfEntries = 20;
        var pageNumber = params.page_number-1;

        return new Promise((resolve, reject) => {
            Media.getLatestMedia(filters, pageNumber, noOfEntries).then(function(data){
                if(data.length > 0){
                        data.forEach(function(mediadata){       
                                        var lists = [];                             
                                        Like.getLikesForMedia(mediadata.id).then((likes)=>{
                                            mediadata.likes=likes;
                                        });

                                        if(userDetails){
                                            List.getMediaListIds(mediadata.id, userDetails.id).then(fetchedlists=>{
                                                if(fetchedlists.length > 0){
                                                    fetchedlists.forEach(function(list){
                                                        lists.push(list.list_id);
                                                    })
                                                }
                                                mediadata.lists = lists;
                                            })
                                        }

                                        Comment.getCommentsForMedia(mediadata.id).then((comments)=>{
                                            mediadata.comments=comments;
                                            length++;
                                            if(length == data.length){
                                                resolvedata();
                                            }
                                        });
                                        
                                    /*getCommentsForMedia(mediadata.id).then((comments)=>{
                                        mediadata.comments=comments;
                                        if(length == data.length){
                                            resolvedata();
                                        }
                                    });*/

                                });

                        function resolvedata(){
                            resolve(data);
                        }
                }
                else
                {
                    let errorObject = errorFormatter.createErrorObject({
                        status: 500,
                        message: "no data found",
                        details:{message:'Your search query returned no data'}
                    });
                    return reject(errorObject);
                }
            });
        });
    }

    function getMediaDetailsById(id, userDetails){
        var LikesPromise;
        var CommentsPromise;
        
        return new Promise((resolve, reject) => {
            Media.getMediaDetailsById(id).then(function(data){
                        data.forEach(function(mediadata){  
                                        var lists = [];
                                        var PreviousId = new Promise((resolve,reject)=>{

                                        })
                                        Media.getPreviousId(mediadata.work_id, mediadata.position).then((previousMediaId)=>{
                                            mediadata.previousMediaId = previousMediaId;
                                        }).catch(err=>{
                                            console.log(err);
                                        })

                                        Media.getNextId(mediadata.work_id, mediadata.position).then((nextMediaId)=>{
                                            mediadata.nextMediaId = nextMediaId;
                                        }).catch(err=>{
                                            console.log(err);
                                        })

                                        Like.getLikesForMedia(mediadata.id).then((likes)=>{
                                            mediadata.likes=likes;
                                        }).catch(err=>{
                                            console.log(err);
                                        })

                                        if(userDetails){
                                            List.getMediaListIds(mediadata.id, userDetails.id).then(fetchedlists=>{
                                                if(fetchedlists.length > 0){
                                                    fetchedlists.forEach(function(list){
                                                        lists.push(list.list_id);
                                                    })
                                                }
                                                mediadata.lists = lists;
                                            }).catch(err=>{
                                            console.log(err);
                                            })
                                        }

                                        Comment.getCommentsForMedia(mediadata.id).then((comments)=>{
                                            mediadata.comments=comments;
                                            resolvedata();
                                        }).catch(err=>{
                                            console.log(err);
                                        });
                                });

                        function resolvedata(){
                            console.log("resolveinginginigng");
                            resolve(data[0]);
                        }
                
            });
        });
    }

    function fetchAllMediaDetailsByProjectId (projectId) {
        var length = 0;
        var LikesPromise;
        var CommentsPromise;
        return new Promise((resolve, reject) => {
            Media.fetchAllMediaDetailsByProjectId(projectId).then(function(data){
                if(data){
                        data.forEach(function(mediadata){                                    
                                        Like.getLikesForMedia(mediadata.id).then((likes)=>{
                                            mediadata.likes=likes;
                                        });

                                        Comment.getCommentsForMedia(mediadata.id).then((comments)=>{
                                            mediadata.comments=comments;
                                            length++;
                                            if(length == data.length){
                                                resolvedata();
                                            }
                                        });
                                    
                                    /*getCommentsForMedia(mediadata.id).then((comments)=>{
                                        mediadata.comments=comments;
                                        if(length == data.length){
                                            resolvedata();
                                        }
                                    });*/

                                });

                        function resolvedata(){
                            resolve(data);
                        }
                }
            });
        });
    }

    function uploadImages(images,projectId,userId){
        var objects = [];
        images.forEach(function(image){
            objects.push({work_id:projectId, user_id:userId, media_type:1, link:image.url});
        });
        return new Promise((resolve,reject)=>{
            Media.uploadImages(objects, projectId).then((data)=>{
                return resolve(data);
            })
        })        
    }


    function uploadBlog(blog,projectId,userId){
        var object = {work_id:projectId, user_id:userId, media_type:2, link:null, blog:blog};

        return new Promise((resolve,reject)=>{
            Media.uploadBlog(object, projectId).then((data)=>{
                return resolve(true);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function getAllMediaForProject(projectId){
        return new Promise((resolve,reject)=>{
            Media.getAllMediaForProject(projectId).then((media)=>{
                return resolve(media);
            })
        })
    }

    function deleteMediaByWorkId(projectId, userId){
        return new Promise((resolve,reject)=>{
            Media.deleteMediaByWorkId(projectId, userId).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }


    function uploadYoutube(projectId,userId, youtubeId){
        var object = {work_id:projectId, user_id:userId, media_type:3, link:youtubeId};
        return new Promise((resolve,reject)=>{
            Media.uploadYoutube(object, projectId).then((data)=>{
                return resolve(true);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function uploadSoundcloud(projectId,userId, soundcloudId){
        var object = {work_id:projectId, user_id:userId, media_type:4, link:soundcloudId};
        return new Promise((resolve,reject)=>{
            Media.uploadSoundcloud(object, projectId).then((data)=>{
                return resolve(true);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function getMediaByUserIdProjectIdAndMediaId(userId, projectId, mediaId){
        return new Promise((resolve, reject)=>{
            Media.getMediaByUserIdProjectIdAndMediaId(userId, projectId, mediaId).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function updateMediaBlog(userId,projectId,mediaId,blog){
        return new Promise((resolve,reject)=>{
            Media.updateMediaBlog(userId,projectId,mediaId,blog).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function deleteMediaById(mediaId, userId){
        return new Promise((resolve,reject)=>{
            Media.deleteMediaById(mediaId, userId).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function likeMedia(mediaId, userId){
        return new Promise((resolve,reject)=>{
            Like.likeMedia(mediaId, userId).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function unlikeMedia(mediaId, userId){
        return new Promise((resolve,reject)=>{
            Like.unlikeMedia(mediaId, userId).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function commentOnMedia(data, userDetails){
        var mediaId = data.media_id;
        var comment = data.hiddentext;

        return new Promise((resolve,reject)=>{
            Comment.commentOnMedia(comment,mediaId,userDetails.id)
            .then(data=>{

                var data2=JSON.parse(JSON.stringify(data));
                data2.user={
                    name:userDetails.name,
                    username:userDetails.username,
                    image:userDetails.image
                }
                //data.user = JSON.parse(JSON.stringify(userDetails));
                return resolve(data2);
            }).catch(err=>{
                return reject(err);
            })
        })
        
    }

    function deleteCommentFromMedia(params, userId){
        return new Promise((resolve,reject)=>{
            Comment.deleteCommentFromMedia(params.id, params.media_id, userId)
            .then(function(data){
                return resolve(data);
            }).catch(error=>{
                return reject(error);
            })
        })
    }

    function addToFavoriteList(params,userId,type){
        var object = {
            user_id: userId,
            media_id: params.media_id,
            type:type,
            list_id:params.list_id
        }

        return new Promise((resolve,reject)=>{
            List.saveFavoriteToList(object).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })

    }

    function deleteFromFavoriteList(params,userId){
        var object = {
                media_id:params.media_id,
                list_id:params.list_id,
                user_id:userId
        }

        return new Promise((resolve,reject)=>{
            List.deleteFromFavoriteList(object).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function getMediaById(id){
        return new Promise((resolve,reject)=>{
            Media.getMediaById(id).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    return {
        fetchAllMedia,
        uploadImages,
        getAllMediaForProject,
        uploadBlog,
        deleteMediaByWorkId,
        uploadYoutube,
        uploadSoundcloud,
        getMediaByUserIdProjectIdAndMediaId,
        updateMediaBlog,
        fetchAllMediaDetailsByProjectId,
        deleteMediaById,
        getMediaDetailsById,
        likeMedia,
        unlikeMedia,
        commentOnMedia,
        deleteCommentFromMedia,
        addToFavoriteList,
        deleteFromFavoriteList
    };
};