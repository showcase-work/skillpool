"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;

    var List = sequelize.define("List", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        list_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        type: Sequelize.STRING,
        media_id: Sequelize.STRING
    },
        {
            tableName: "lists",
            timestamps: false
        }
    );

    function getMediaListIds(mediaId, userId){
        return List.findAll({
            attributes:["list_id"],
            where:{
                media_id:mediaId,
                user_id:userId
            }
        });
    }

    function saveFavoriteToList(object){
        var newfavorite = List.build(object)
        return newfavorite.save();
    }

    function deleteFromFavoriteList(object){
        return List.destroy({
            where:object
        });
    }

    return {
        List,
        getMediaListIds,
        saveFavoriteToList,
        deleteFromFavoriteList
    };
};
