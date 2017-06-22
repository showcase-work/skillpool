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

    function commentOnMedia(comment, mediaId, userId){
        return Comment.build({
            user_id:userId,
            media_id:mediaId,
            comment:comment
        }).save();
    }

    function deleteCommentFromMedia(id, mediaId, userId){
        return Comment.destroy({
            where:{
                id:id,
                media_id:mediaId,
                user_id:userId
            }
        })
    }


    return {
        Comment,
        getCommentsForMedia,
        commentOnMedia,
        deleteCommentFromMedia
    };
};
