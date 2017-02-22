"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;
    let User = app.models.user.User;

    var Comment = sequelize.define("Comment", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        
        user_id: Sequelize.INTEGER,
        media_id: Sequelize.INTEGER,
        comment: Sequelize.STRING

    },
        {
            tableName: "comments_works_media",
            timestamps: false
        }
    );

    Comment.belongsTo(User,{foreignKey:"user_id"});

    function getCommentsForMedia(media_id){
            return Comment.findAll({
                raw: true,
                include:[{model:User}],
                where: {
                    media_id: media_id
                },
            });
    }


    return {
        Comment,
        getCommentsForMedia
    };
};
