"use strict";
let Sequelize = require("sequelize");
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;

    var DataType = sequelize.define("DataType", {
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
            tableName: "datatypes",
            timestamps: false
        }
    );

    function getAllDataTypes(mediaId, userId){
        console.log("huhu2");

        return DataType.findAll({
            attributes:["text","value"]
        });
    }


    return {
        DataType,
        getAllDataTypes
    };
};
