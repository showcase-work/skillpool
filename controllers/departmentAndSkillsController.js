"use strict";

module.exports = app => {
    let departmentAndSkillsService = app.services.departmentAndSkills

    function fetchAllDepartments(req, res, next){
        departmentAndSkillsService.fetchAllDepartments().then((data)=>{
            res.send(data);
        })
    }

    function getDepartmentAndRenderPage(req,res,next){
        departmentAndSkillsService.fetchAllDepartments().then((data)=>{
            return res.render("usersettings/department", {user:req.user, tab:'department', departments:data});
        }).catch(err=>{
            next(err);
        })
    }

    function renderCompleteProfile(req,res,next){
        departmentAndSkillsService.fetchAllDepartments().then((data)=>{
            return res.render("modals/completeProfile", {departments:data});
        }).catch(err=>{
            next(err);
        })
    }

    return {
        fetchAllDepartments,
        getDepartmentAndRenderPage,
        renderCompleteProfile
    }
}