"use strict";

module.exports = app => {

    let listsService = app.services.listsService;

    function getAllSkills (req, res, next) {
            listsService.getAllSkills(req.query)
            .then(data => {
                res.send(data);
            }).catch(err => next(err));
    };

    function getAllTags (req, res, next) {
            listsService.getAllTags()
            .then(data => {
                res.send(data);
            }).catch(err => next(err));
    };


    function getAllDataTypes (req, res, next) {
            listsService.getAllDataTypes()
            .then(data => {
                res.send(data);
            }).catch(err => next(err));
    };


    function getAllDepartments (req, res, next) {
            listsService.getAllDepartments()
            .then(data => {
                res.send(data);
            }).catch(err => next(err));
    };

    return {
        getAllSkills,
        getAllTags,
        getAllDataTypes,
        getAllDepartments
    };
};