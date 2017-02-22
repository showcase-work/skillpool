"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;

    var Skill = sequelize.define("Skill", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: Sequelize.STRING,
        position: Sequelize.INTEGER,
        department_id: Sequelize.INTEGER,
        visible: Sequelize.BOOLEAN,
        },
        {
            tableName: "skills",
            timestamps: false,
        },
        {
            dialect:'mysql'
        }
    );

    function getSkillsByIds(skillIdsArray){
        console.log("working in skills model");
        console.log(skillIdsArray);

        return new Promise((resolve,reject)=>{
            Skill.findAll({
                where:{
                    id:skillIdsArray
                }
            }).then(data=>{
                return resolve(data);
            }).catch(err=>{
                return reject(err);
            })
        })
        
    }

    return {
        Skill,
        getSkillsByIds
    };
};
