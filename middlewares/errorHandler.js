"use strict";

module.exports = app => {

// development error handler
    if (app.get("env") === "development") {
        app.use((err, req, res, next) => {
            res.status(err.status);
            res.json(err);
        });
    }
    else if(app.get("env") === "production"){
        app.use((err, req, res, next) => {
            res.status(err.status);
            res.json(err);

        });
    }

// production error handler
    

};