"use strict";

module.exports = app => {
    let productsService = app.services.productsService;

    function fetchAllProducts (req, res, next) {
            productsService.fetchAllProducts()
            .then(data => {
                res.send(data);
            }).catch(err => next(err));
    };

    return {
        fetchAllProducts
    };
};