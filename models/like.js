"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;
    let User = app.models.user.User;

    var Like = sequelize.define("Like", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        
        user_id: Sequelize.INTEGER,
        media_id: Sequelize.INTEGER
    },
        {
            tableName: "likes_works_media",
            timestamps: false
        }
    );

    Like.belongsTo(User,{foreignKey:"user_id"});

    function getLikesForMedia(media_id){
            return Like.findAll({
                raw: true,
                include:[{model:User}],
                where: {
                    media_id: media_id
                },
            }).then(function(data){
                return data;
            });
    }


    return {
        Like,
        getLikesForMedia
    };
};
