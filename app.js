"use strict";
let express = require("express");
let consign = require("consign");
let logger = require("winston");
let app = express();
let appPort = process.env.AB_APP_PORT || "8080";
consign()
    .include("./helpers")
    .then("./middlewares/basicSettings.js")
    .then("./config")
    .then("./db/connection.js")
    .then("./middlewares/staticResources.js")
    .then("./validators/schemas")
    .then("./validators")
    .then("./models/skill.js")
    .then("./models/user.js")
    .then("./models/work.js")
    .then("./models")
    .then("./auth/passport.js")
    .then("./services")
    .then("./controllers")
    .then("./routes")
    .then("./middlewares/mainRoutes.js")
    .then("./middlewares/errorHandler.js")
    .into(app);

if (process.env.NODE_ENV !== "test") {
    app.listen(appPort, () => {
        logger.info(`Server started on port ${appPort}`);
    });
}


module.exports = app;