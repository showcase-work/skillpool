"use strict";

module.exports = app => {
    let Tags = app.models.Tags;

    function checkAndAddTags (tags) {        
        return new Promise((resolve,reject)=>{
            var tagArray = tags.split(",");
            tagArray.forEach(function(tag){
                Tags.checkAndAddTags(tag);
            }) 
        })
    }

    return {
        checkAndAddTags,
    };
};