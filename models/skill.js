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
            return Skill.findAll({
                where:{
                    id:skillIdsArray
                },
                raw: true
            })
    }

    function getSkillsByDepartmentId(params){
        return Skill.findAll({
            where: params
        });
    }

    return {
        Skill,
        getSkillsByIds,
        getSkillsByDepartmentId
    };
};
