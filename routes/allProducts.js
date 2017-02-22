"use strict";

let router = require("express").Router();

module.exports = app => {
    let productsController = app.controllers.productsController;

    router.route("/").get((req, res, next) => {
        return productsController.fetchAllProducts(req, res, next);
    });

    return router;
};