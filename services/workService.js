"use strict";

module.exports = app => {
    let Work = app.models.work;
    let Media = app.models.media;
    let User = app.models.user;
    let Skill = app.models.skill;
    let Department = app.models.department;
    let Like = app.models.like;
    let Comment = app.models.comment;

    function getWorkById(id, userId){

        return new Promise((resolve,reject)=>{
            Work.getWorkById(id).then((data)=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function addWork(params, userId){
        console.log("working in service");
        return new Promise((resolve,reject)=>{
            Work.addWork(params, userId).then(function(data){
                return resolve(data);
            })
        })
    }

    function updateWork(params, userId){
        console.log("working in update workm service");
        return new Promise((resolve,reject)=>{
            Work.updateWork(params, userId).then(function(data){
                return resolve(data);
            })
        })
    }

    function updateMedia(params, userId){
        
            var i=0;
            var c = [];
            params.mediaid.forEach(function(id){

                var p = new Promise((resolve,reject)=>{
                                Media.updateMedia({description:params.mediadescription[i], tags:params.mediatags[i], position:params.position[i]}, params.mediaid[i], userId).then((response) => {
                                    return resolve(response);
                                }).catch(err=>{
                                    return reject(err);
                                });
                })
                c.push();
                i++;
            })


            return new Promise((resolve2,reject2)=>{
                Promise.all(c).then((data)=>{
                    return resolve2(data);
                })
            })
            /*work.updateMedia((params, userId).then(data=>{
                return resolve(data)
            }))*/
    }

    function getAllWorksByUserId(id){
        return new Promise((resolve,reject)=>{
            var array = [];
            Work.getAllWorksByUserId(id).then(data=>{
                data.forEach((work)=>{
                    array.push(Media.getMediaById(work.cover));
                })
                var dataToSend = JSON.parse(JSON.stringify(data));
                Promise.all(array).then(values=>{
                    for(var i=0; i < data.length; i++){
                        dataToSend[i].coverDetails = values[i];
                    }
                    return resolve(dataToSend);
                })                
            }).catch(err=>{
                return reject(err);
            })
        })
    }

    function deleteWork(id,userId){
        return new Promise((resolve,reject)=>{
            Work.deleteWork(id, userId).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
        
    }

    function updateWorkCover(userId, workId, coverId){
        return new Promise((resolve, reject)=>{
            Work.updateWorkCover(userId, workId, coverId)
            .then(data=>{
                return resolve(data);
            })
            .catch(err=>{
                return reject(err);
            })
        })
    }

    function fetchAllMediaDetailsByProjectId(projectId){

        return new Promise((resolve,reject)=>{
            var objectToSendBack = {};
            Work.getWorkById(projectId).then(data=>{
                if(data)
                var userDetailsPromise = User.getme(data.user_id);
                var mediaDetailsPromise = Media.getAllMediaForProject(projectId);
                objectToSendBack = JSON.parse(JSON.stringify(data));
                return Promise.all([userDetailsPromise,mediaDetailsPromise])
            }).then(details=>{
                objectToSendBack.userDetails = details[0];
                var mediaDetails = JSON.parse(JSON.stringify(details[1]));
                mediaDetails.forEach(mediadata=>{
                    Like.getLikesForMedia(mediadata.id).then((likes)=>{
                        mediadata.likes=likes;
                    });

                    Comment.getCommentsForMedia(mediadata.id).then((comments)=>{
                        mediadata.comments=comments;
                    });
                })
                console.log("qweasd");
                console.log(mediaDetails);
                objectToSendBack.mediaDetails = mediaDetails;
                var skillsPromise = Skill.getSkillsByIds(objectToSendBack.userDetails.skills.split(','));
                var departmentPromise = Department.getDepartmentsById(objectToSendBack.userDetails.departments.split(','));
                
                return Promise.all([skillsPromise,departmentPromise]);
            }).then(skillsAndDeptDetails=>{
                objectToSendBack.departmentDetails = [];
                skillsAndDeptDetails[1].forEach(departmentDetails=>{
                    var newDepartmentDetails = JSON.parse(JSON.stringify(departmentDetails));
                    newDepartmentDetails.skills = [];
                    skillsAndDeptDetails[0].forEach(skillsDetails=>{
                        if(skillsDetails.department_id == departmentDetails.id){
                            newDepartmentDetails.skills.push(skillsDetails);
                        }
                    })
                    objectToSendBack.departmentDetails.push(newDepartmentDetails);
                    return resolve(objectToSendBack);
                })

            })
            .catch(err=>{
                return reject(err);
            })
        })
        
    }


    return {
        getWorkById,
        addWork,
        updateWork,
        updateMedia,
        getAllWorksByUserId,
        deleteWork,
        updateWorkCover,
        fetchAllMediaDetailsByProjectId
    }
}