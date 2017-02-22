"use strict";

module.exports = app => {
    let mediaService = app.services.mediaService;

    function fetchPagesForDiscover (req, res, next) {
        console.log("query is asd asd");
            mediaService.fetchAllMedia(req.query)
            .then(data => {
                res.render("discover/fetch-pages-for-discover",{media:data, user:req.user});
            }).catch(err => console.log(err));
    };
    
    return {
        fetchPagesForDiscover
    };
};