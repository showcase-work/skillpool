"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;
    let User = app.models.user.User;

    var CustomLists = sequelize.define("CustomLists", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        list_name: Sequelize.STRING,
        list_description: Sequelize.STRING,
        list_tags: Sequelize.STRING,
        user_id: Sequelize.INTEGER,
    },
        {
            tableName: "custom_lists",
            timestamps: false
        }
    );

    CustomLists.belongsTo(User,{foreignKey:"user_id"});

    function getUserLists(userId){
        return CustomLists.findAll({
            where:{
                user_id:userId
            }
        });
    }

    function addCustomList(object, userId){
        return CustomLists.build({
            list_name:object.listName,
            list_description:object.listDescription,
            list_tags:object.listTags,
            user_id:userId
        }).save();
    }

    return {
        CustomLists,
        getUserLists,
        addCustomList
    };
};
