"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;

    var Tags = sequelize.define("Tags", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        
        text: Sequelize.STRING,
        value: Sequelize.STRING
    },
        {
            tableName: "tags",
            timestamps: false
        }
    );

    function getAllTags(mediaId, userId){
        return Tags.findAll({
            attributes:["text","value"]
        });
    }


    return {
        Tags,
        getAllTags
    };
};
