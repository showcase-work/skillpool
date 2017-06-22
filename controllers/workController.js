"use strict";

module.exports = app => {

    let imagesService = app.services.cloudinary;
    let mediaService = app.services.mediaService;
    let workService = app.services.workService;
    let tagsService = app.services.tagsService;

    function fetchAllMedia (req, res, next) {
            mediaService.fetchAllMedia({},req.user)
            .then(data => {
                res.send(data);
            }).catch(err => next(err));
    };

    function uploadMultipleImages(req,res,next){
        var userId = req.user.id;
        var files = req.files;
        var projectId = req.body.projectId;
        var workData = null

        workService.getWorkById(projectId).then((work)=>{
            if(userId != work.user_id){
                res.send("user id and work user id dont match");
                res.end();
            }
            else{
                workData = work;
                return imagesService.uploadMultipleImages(files);
            }
        }).then(function(images){
            return mediaService.uploadImages(images,projectId,userId);
        }).then((isUploaded)=>{
            if(isUploaded){
                res.send(projectId);
            }
        }).catch(err=>{
            console.log(err);
            next(err);
        })
    }

    function getWorkEditPage(req,res,next){
        var projectId = req.query.id;
        var userId = req.user.id;
        var workData = null;
        workService.getWorkById(projectId).then((work)=>{
            if(userId != work.user_id){
                res.send("user id and work user id dont match");
                res.end();
            }
            else{
                workData = work;
                return mediaService.getAllMediaForProject(projectId);
            }
        }).then((media)=>{
            return res.render("works/editwork", {user:req.user, tab:'works', media:media, project:workData});
        }).catch(err=>{
            console.log(err);
        })
    }

    function addWork(req,res,next){
        workService.addWork(req.body, req.user.id).then(function(data){
            tagsService.checkAndAddTags(req.body.tags);
            res.send(data);
        }).catch(err=>{
            console.log(err);
        })
    }

    function updateWork(req,res,nect){
        workService.updateWork(req.body, req.user.id).then(function(data){
            tagsService.checkAndAddTags(req.body.tags);
            res.redirect("/works/edit-work?id="+req.body.projectId);
        }).catch(err=>{
            console.log(err);
        })
    }

    function updateMedia(req,res,next){
        workService.updateMedia(req.body,req.user.id).then((data)=>{
            console.log(data);
            console.log("working??");
            //console.log({media:data, projectId:req.body.projectId});
            //res.render("works/addMediaToEditWorks", {media:data, projectId:req.body.projectId});
            res.redirect("/works/edit-work?id="+req.body.projectId);
        }).catch(err=>{
            console.log(err);
        })
    }

    function uploadBlog(req, res, next){
        var userId = req.user.id;
        var blog = req.body.blog;
        var projectId = req.body.projectId;
        var workData = null
        workService.getWorkById(projectId).then((work)=>{
            if(userId != work.user_id){
                res.send("user id and work user id dont match");
                res.end();
            }
            else{
                return mediaService.uploadBlog(blog,projectId,userId)
            }
        }).then(result=>{
            res.send(projectId); 
        }).catch(err=>{
            console.log(err);
        })
    }

    function getAllWorksByUserId(req ,res, next) {
        var userId = req.user.id;
        workService.getAllWorksByUserId(userId).then(data=>{
            //res.send(data);
            return res.render("usersettings/works", {user:req.user, tab:'works', works:data});
        }).catch(err=>{
            console.log(err);
        })
    }

    function deleteWork(req, res, next){
        var userId = req.user.id;
        var projectId = req.params.id;
        workService.getWorkById(projectId).then((work)=>{
            if(userId != work.user_id){
                res.send("user id and work user id dont match");
                res.end();
            }
            else{
                return workService.deleteWork(projectId, userId);
            }
        })
        .then(data=>{
            return mediaService.deleteMediaByWorkId(projectId, userId);
        }).then(data=>{
            res.redirect("/user-settings/works");
        })
        .catch(err=>{
            next(err);
        })
    }

    function deleteMedia(req, res, next){
        var userId = req.user.id;
        var mediaId = req.params.id;
        mediaService.deleteMediaById(mediaId, userId)
        .then(data=>{
            if(data){
                res.send(true);
            }
            else
            {
                res.send(false);
            }
            
        })
        .catch(err=>{
            next(err);
        })
    }

    function updateWorkCover(req, res, next){
        var userId = req.user.id;
        var projectId = req.body.projectId;
        var coverId = req.body.coverId;
        workService.updateWorkCover(userId,projectId,coverId).then((data)=>{
            res.send(data);
        })
        .catch(err=>{
            next(err);
        })
    }

    function uploadYoutube(req, res, next){
        var youtubeId = req.body.youtubeId;
        var userId = req.user.id;
        var projectId = req.body.projectId;
        mediaService.uploadYoutube(projectId,userId,youtubeId).then((data)=>{
            res.send(projectId);
        })
        .catch(err=>{
            next(err);
        })
    }

    function uploadSoundcloud(req,res,next){
        var soundcloudId = req.body.soundcloudId;
        var userId = req.user.id;
        var projectId = req.body.projectId;
        mediaService.uploadSoundcloud(projectId,userId,soundcloudId).then((data)=>{
            res.send(projectId);
        })
        .catch(err=>{
            next(err);
        })
    }

    function getMediaAndRenderBlog(req,res,next){
        var projectId = req.query.projectId;
        var userId = req.user.id;
        var mediaId = req.query.mediaId;
        var mediaData = false;
        mediaService.getMediaByUserIdProjectIdAndMediaId(userId, projectId, mediaId).then((media)=>{
                if(media){
                    mediaData = media;
                }
                return res.render("modals/editblog", {user:req.user, tab:'works', projectId:projectId, media:mediaData});
        }).catch(err=>{
            console.log(err);
        })
    }

    function updateMediaBlog(req,res,next){
        var userId = req.user.id;
        var projectId = req.body.projectId;
        var mediaId = req.body.mediaId;
        var blog = req.body.blog;
        mediaService.updateMediaBlog(userId,projectId,mediaId,blog).then(data=>{
            res.send(projectId);
        }).catch(err=>{
            next(err);
        })
    }

    function renderProjectPreviewPage(req,res,next){
        var projectId = req.params.id;
        var userId = req.user.id;
        /*mediaService.fetchAllMediaDetailsByProjectId(projectId).then(data=>{
            console.log("working here");
            console.log(data);
            res.send(data);
        })*/

        workService.fetchAllMediaDetailsByProjectId(projectId,req.user).then(data=>{
            //res.send(data);
            res.render("works/preview", {title:"Skillpool | Discover", user:req.user, tab:'works', project:data});
        }).catch(err=>{
            console.log(err);
        })
    }

    function getMediaPreview(req, res, next){
        var mediaId = req.query.media_id;
        mediaService.getMediaDetailsById(mediaId, req.user)
        .then(data=>{   
            //res.send(data[0])
            //res.send(data[0]);
            res.render("modals/preview", {mediaData:data, user:req.user});
        }).catch(err=>{
            console.log(err);
            next(err);
        })
    }

    function likeMedia(req,res,next){
        mediaService.likeMedia(req.body.id, req.user.id)
        .then(data=>{
            res.send(data);
        }).catch(err=>{
            next(err);
        })
    }

    function unlikeMedia(req,res,next){
        mediaService.unlikeMedia(req.body.id, req.user.id)
        .then(data=>{
            if(data ==1){
                res.send(req.body.id);
            }
        }).catch(err=>{
            console.log(err);
            next(err);
        })
    }

    function commentOnMedia(req,res,next){
        mediaService.commentOnMedia(req.body, req.user)
        .then(data=>{
            res.send(data);
        }).catch(err=>{
            next(err);
        })
    }

    function deleteCommentFromMedia(req,res,next){
        mediaService.deleteCommentFromMedia(req.body, req.user.id)
        .then(data=>{
            if(data==1){
                res.send(true);
            }
            else
            {
                res.send(false);
            }
        }).catch(err=>{
            next(err);
        })
    }

    function addToFavoriteListForMedia(req,res,next){
        mediaService.addToFavoriteList(req.body, req.user.id, "Media")
        .then((data)=>{
            res.send(data);
        })
        .catch(err=>{
            next(err);
        })
    }

    function deleteFromFavoriteListForMedia(req,res,next){
        mediaService.deleteFromFavoriteList(req.body, req.user.id)
        .then((data)=>{
            if(data){
                res.send(true);
            }
            else
            {
                res.send(false)
            }
        })
        .catch(err=>{
            next(err);
        })
    }

    function getShareModal(req,res,next){
        mediaService.getMediaById(req.query.id).then(data=>{
            return res.render("modals/skillpoolShareModal",{media:data})
        }).catch(err=>{
            next(err);
        })
    }

    return {
        uploadMultipleImages,
        getWorkEditPage,
        addWork,
        updateWork,
        fetchAllMedia,
        updateMedia,
        uploadBlog,
        getAllWorksByUserId,
        deleteWork,
        updateWorkCover,
        uploadYoutube,
        uploadSoundcloud,
        getMediaAndRenderBlog,
        updateMediaBlog,
        renderProjectPreviewPage,
        deleteMedia,
        getMediaPreview,
        likeMedia,
        unlikeMedia,
        commentOnMedia,
        deleteCommentFromMedia,
        addToFavoriteListForMedia,
        deleteFromFavoriteListForMedia,
        getShareModal
    }
}