"use strict";
let Sequelize = require("sequelize");
let bcrypt = require('bcrypt-nodejs');
let SALT_WORK_FACTOR = 12;
module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;

    var User = sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        
        name: Sequelize.STRING,
        username: {type:Sequelize.STRING, unique:true},
        password: {type:Sequelize.STRING},
        email: Sequelize.STRING,
        position: Sequelize.STRING,
        departments: Sequelize.STRING,
        skills: Sequelize.STRING,
        image: Sequelize.STRING,
        facebook: Sequelize.STRING,
        twitter: Sequelize.STRING,
        linkedin: Sequelize.STRING,
        college: Sequelize.STRING,
        course: Sequelize.STRING,
        youtube: Sequelize.STRING,
        behance: Sequelize.STRING,
        website: Sequelize.STRING,
        about: Sequelize.STRING,
        fb_image: Sequelize.STRING,
        city: Sequelize.STRING,
        contact: Sequelize.INTEGER,
        college_end_year: Sequelize.INTEGER,
        facebook: Sequelize.JSON,
        twitter: Sequelize.JSON,
        google: Sequelize.JSON,
        facebook_id: Sequelize.STRING
        },
        {
            tableName: "users",
            timestamps: false,

            instanceMethods: {
                generateHash: function(password){
                    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                },

                validPassword: function(password){
                    return bcrypt.compareSync(password, this.password);
                }

            }

        },
        {
            dialect:'mysql'
        }
    );

    User.beforeCreate(function(user, options) {
        var hashedPw = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
        user.password = hashedPw;
    });

    function updateProfilePicture(url,id){
        console.log(url);
        console.log(id);
        console.log("working in model now ");
        return new Promise(function (resolve, reject) {
            User.update(
            {
                image:url
            },
            {
                where: { 
                    id:id
                }
            }
            ).then(function(){
                console.log("updated successfully");
                return resolve(true);
            }).catch(function(e){
                console.log("updating faile"+e);
                return reject(e);
            })
        });
    }

    function getme(id){
        return new Promise((resolve,reject)=>{
            console.log("working in getme model");
            console.log(id);

            User.findById(id).then(user=>{
                return resolve(user);
            })
        })
    }

    function updatePersonalDetails(params, id){
        return new Promise((resolve,reject)=>{
            User.update(
            {
                name:params.name,
                about:params.about,
                contact:params.contact,
                city:params.city,
                college:params.college,
                course:params.course
            },
            {
                where: { 
                    id:id
                }
            }
            ).then(function(){
                console.log("updated successfully");
                return resolve(true);
            }).catch(function(e){
                console.log("updating faile"+e);
                return reject(e);
            })
        })
    }

    function updateDepartmentAndSkillsDetails(params, id){

        return new Promise((resolve,reject)=>{
            User.update(
            {
                departments:(params.departments).toString(),
                skills:(params.skills).toString(),
            },
            {
                where: { 
                    id:id
                }
            }
            ).then(function(){
                console.log("updated successfully");
                return resolve(true);
            }).catch(function(e){
                console.log("updating faile"+e);
                return reject(e);
            })
        })

    }

    function unlinkAccount(account,id){
        var field = null;
        if(account=="facebook"){
            field={facebook:null};
        }
        if(account=="twitter"){
            field={twitter:null};
        }
        if(account=="google"){
            field={google:null};
        }
        return new Promise((resolve,reject)=>{
            User.update(
            field,
            {
                where: { 
                    id:id
                }
            }
            ).then(function(){
                console.log("updated successfully");
                return resolve(true);
            }).catch(function(e){
                console.log("updating faile"+e);
                return reject(e);
            })
        })
    }

    return {
        User,
        updateProfilePicture,
        updatePersonalDetails,
        updateDepartmentAndSkillsDetails,
        unlinkAccount,
        getme
    };
};
