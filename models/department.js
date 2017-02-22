"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;
    let Skill = app.models.skill.Skill;

    var Department = sequelize.define("Department", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        department_name: Sequelize.STRING,
        position: Sequelize.INTEGER,
        visible: Sequelize.BOOLEAN,
        personalized_name: Sequelize.STRING,
        span_class: Sequelize.STRING,
        },
        {
            tableName: "departments",
            timestamps: false,
        },
        {
            dialect:'mysql'
        }
    );

    Department.hasMany(Skill, {foreignKey:'department_id'});


    function fetchAllDepartments(){
        return new Promise((resolve,reject)=>{
            Department.findAll({
                raw: true,
                include: [{model: Skill}],
                order:['position']
            }).then((data)=>{
                return resolve(data);
            }).catch((err)=>{
                console.log(err);
            })
        }) 
    }

    function getDepartmentsById(departmentIdsArray){
        console.log("working in skills model");
        console.log(departmentIdsArray);

        return new Promise((resolve,reject)=>{
            Department.findAll({
                where:{
                    id:departmentIdsArray
                }
            }).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
        
    }

    return {
        Department,
        fetchAllDepartments,
        getDepartmentsById
    };
};
