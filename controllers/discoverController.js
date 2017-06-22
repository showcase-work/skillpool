"use strict";

module.exports = app => {
    let mediaService = app.services.mediaService;

    function fetchPagesForDiscover (req, res, next) {
            mediaService.fetchAllMedia(req.query, req.user)
            .then(data => {
                //res.send(data);
                res.render("discover/fetch-pages-for-discover",{media:data, user:req.user});
            }).catch(err => next(err));
    };
    
    return {
        fetchPagesForDiscover
    };
};