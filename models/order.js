"use strict";
let Sequelize = require("sequelize");

module.exports = app => {

    let sequelize = app.db.connection;
    let logger = app.helpers.logger;
    let errorFormatter = app.helpers.errorFormatter;
    /*let UserSource = app.models.userSource.UserSource;
    let User = app.models.user.User;
    let Location = app.models.location.Location;*/

    var Order = sequelize.define("Order", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        cloud_site_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        source_id: Sequelize.INTEGER,
        order_status: Sequelize.INTEGER,
        order_amount: Sequelize.INTEGER,
        payment_mode: Sequelize.INTEGER,
        order_completion_status: Sequelize.INTEGER,
        date_added: Sequelize.DATE,
        location_id: Sequelize.INTEGER,
        oo_order_id: Sequelize.INTEGER,
        vn_order_id: Sequelize.INTEGER,
        pos_order_id: Sequelize.INTEGER,
        new_pos_order_id: Sequelize.INTEGER,
        ma_order_id: Sequelize.INTEGER,
        third_party_order_id: Sequelize.INTEGER,
        order_type: Sequelize.INTEGER,
        campaign_id: Sequelize.INTEGER,
        order_sent_time: Sequelize.DATE,
        order_accept_time: Sequelize.DATE,
        order_dispatch_time: Sequelize.DATE,
        order_decline_time: Sequelize.DATE,
        order_delivery_time: Sequelize.DATE,
        reference_bill_number: Sequelize.STRING,
        bill_number: Sequelize.STRING,
        user_new_old: Sequelize.INTEGER
    },
        {
            tableName: "cloud_site_user_processed_orders",
            timestamps: false
        }
  );

    /*Order.belongsTo(OrderSource, {foreignKey: "source_id"});
    Order.belongsTo(UserSource, {foreignKey: "user_id"});
    Order.belongsTo(Location, {foreignKey: "location_id"});
    Order.belongsTo(User, {foreignKey: "user_id", target: "user_id"});*/

    function fetchOrdersByOrderSources (filters) {

        var filters1 = JSON.parse(JSON.stringify(filters));
        filters1.order_status = [2, 3, 5, 11];
        filters1.date_added = filters.date_added;
// remove the join and hardcode the mapping values for all.

        return new Promise(function (resolve, reject) {
            Order.findAll({
                raw: true,
                /*include: [{
                    model: OrderSource,
                    attributes: ["source_name"]
                }],*/
                attributes: [
                    "source_id",
                          [Sequelize.fn("SUM", Sequelize.col("order_amount")), "revenue"],
                          [Sequelize.fn("COUNT", Sequelize.col("id")), "orders_count"]
                ],
                where: {
                    $and: filters1
                },
                group: "Order.source_id",
                order: "revenue DESC"
            }).then(function (data) {
                if (!data || data === "") {
                    let errorObject = errorFormatter.createErrorObject({
                        status: 500,
                        message: "no orders found - Sequelize"
                    });
                    return reject(errorObject);
                }
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching orders by sources - Sequelize",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });

    }

    function fetchOrdersByPaymentMode (filters) {

        var filters1 = JSON.parse(JSON.stringify(filters));
        filters1.date_added = filters.date_added;

        filters1.order_status=[2,3,5,11];
        filters1.payment_mode=[0,1,2,3,4,5,6,7,8,9,10,11];


        return new Promise(function (resolve, reject) {
            Order.findAll({
                raw: true,
                attributes: [
                    "payment_mode",
                          [Sequelize.fn("SUM", Sequelize.col("order_amount")), "revenue"],
                          [Sequelize.fn("COUNT", Sequelize.col("id")), "orders_count"]
                ],
                where: {
                    $and: filters1
                },
                group: "Order.payment_mode",
                order: "revenue DESC"
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching orders by payment mode - Sequelize",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function fetchOrdersByOrderStatus (filters) {
        var filters1 = JSON.parse(JSON.stringify(filters));
        filters1.order_status = [0, 1, 2, 3, 4, 5, 11, 12];
        return new Promise(function (resolve, reject) {
            Order.findAll({
                raw: true,
                attributes: [
                    "order_status",
                          [Sequelize.fn("SUM", Sequelize.col("order_amount")), "revenue"],
                          [Sequelize.fn("COUNT", Sequelize.col("id")), "orders_count"]
                ],
                where: {
                    $and: filters1
                },
                group: "Order.order_status"
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching orders by status - Sequelize",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function fetchOrdersByDate (date_type, filters) {

        var filters1 = JSON.parse(JSON.stringify(filters));
        filters1.date_added = filters.date_added;
        filters1.order_status = [2, 3, 5, 11];

        return new Promise(function (resolve, reject) {

            Order.findAll({
                raw: true,
                attributes: [
                          [Sequelize.fn("SUM", Sequelize.col("order_amount")), "revenue"],
                          [Sequelize.fn("COUNT", Sequelize.col("id")), "orders_count"],
                          [Sequelize.fn("DATE_FORMAT", Sequelize.literal("`date_added`,'" + date_type + "'")), "date"]
                ],
                where: {
                    $and: filters1
                },
                group: [Sequelize.fn("DATE_FORMAT", Sequelize.literal("`date_added`,'" + date_type + "'"))],
                order: "'date_added'"
            }).then(function (data) {
                if (!data || data === "") {
                    let errorObject = errorFormatter.createErrorObject({
                        status: 500,
                        message: "no orders found - Sequelize"
                    });
                    return reject(errorObject);
                }
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching orders by date - Sequelize"
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function fetchOrdersByOrderType (filters) {

        var filters1 = JSON.parse(JSON.stringify(filters));
        filters1.date_added = filters.date_added;
        filters1.order_type = [0, 1, 2];
        filters1.order_status = [2, 3, 5, 11];

        return new Promise(function (resolve, reject) {
            Order.findAll({
                raw: true,
                attributes: [
                    "order_type",
                          [Sequelize.fn("SUM", Sequelize.col("order_amount")), "revenue"],
                          [Sequelize.fn("COUNT", Sequelize.col("id")), "orders_count"]
                ],
                where: {
                    $and: filters1,
                },
                group: "Order.order_type"
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching orders by order-type - Sequelize",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function fetchOrdersByUsers (filters) {
        var filters1 = JSON.parse(JSON.stringify(filters));
        // filters1.order_status=[2,3,5,11];
        filters1.user_new_old = [0, 1, 2];
        return new Promise(function (resolve, reject) {
            Order.findAll({
                raw: true,
                attributes: [
                "user_new_old",
                [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
                ],
                where: {
                    $and: filters1
                },
                group: "Order.user_new_old"
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching orders by users - Sequelize",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function fetchAllOrders (filters, offset) {
        return new Promise(function (resolve, reject) {
            Order.findAll({
                offset: offset,
                limit: 49,
                /*include: [{model: Location}, {model: User}, {model: OrderSource}],*/
                raw: true,
                where: {
                    $and: filters
                },
                order:"date_added DESC"
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching allOrders",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function fetchAllOrdersForCSVExport (filters) {

        return new Promise(function (resolve, reject) {
            Order.findAll({
                /*include: [{model: Location}, {model: User}, {model: OrderSource}],*/
                offset: 0,
                limit: 1000,
                raw: true,
                where: {
                    $and: filters
                },
                order:"date_added DESC"
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching allOrders",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function searchAllOrders (filters, offset, searchFilter) {
        return new Promise(function (resolve, reject) {
            Order.findAll({
                offset: offset,
                limit: 49,
                /*include: [
                    {
                        model: Location,
                    },
                    {
                        model: User,
                    },
                    {
                        model: OrderSource,
                    }
                ],*/
                raw: true,
                where: {
                    $and: filters,
                    $or: [
                        {
                          'reference_bill_number': {
                            $like: '%'+searchFilter+'%'
                          }
                        },
                        {
                          'bill_number': {
                            $like: '%'+searchFilter+'%'
                          }
                        },
                        {
                          '$Location.location_name$': {
                            $like: '%'+searchFilter+'%'
                          }
                        },
                        {
                          "$Location.city$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$Location.state$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$OrderSource.source_name$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$User.first_name$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$User.last_name$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$User.user_mobile_phone_number$": {
                              $like: '%' + searchFilter+"%"
                          }
                        }
                    ]
                },
                order:"date_added DESC"
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching allOrders",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    function searchAllOrdersForCSVExport (filters, searchFilter) {
        return new Promise(function (resolve, reject) {
            Order.findAll({
                /*include: [
                    {
                        model: Location,
                    },
                    {
                        model: User,
                    },
                    {
                        model: OrderSource,
                    }
                ],*/
                offset: 0,
                limit: 1000,
                raw: true,
                where: {
                    $and: filters,
                    $or: [
                        {
                          'reference_bill_number': {
                            $like: '%'+searchFilter+'%'
                          }
                        },
                        {
                          'bill_number': {
                            $like: '%'+searchFilter+'%'
                          }
                        },
                        {
                          '$Location.location_name$': {
                            $like: '%'+searchFilter+'%'
                          }
                        },
                        {
                          "$Location.city$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$Location.state$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$OrderSource.source_name$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$User.first_name$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$User.last_name$": {
                              $like: '%' + searchFilter+"%"
                          }
                        },
                        {
                          "$User.user_mobile_phone_number$": {
                              $like: '%' + searchFilter+"%"
                          }
                        }
                    ]
                },
                order:"date_added DESC"
            }).then(function (data) {
                return resolve(data);
            }).catch(err => {
                let errorObject = errorFormatter.createErrorObject({
                    status: 500,
                    message: "eror fetching allOrders",
                    details: err.message
                });
                logger.error(err);
                return reject(errorObject);
            });
        });
    }

    return {
        fetchOrdersByUsers,
        fetchOrdersByOrderType,
        fetchOrdersByOrderStatus,
        fetchOrdersByPaymentMode,
        fetchOrdersByDate,
        fetchOrdersByOrderSources,
        fetchAllOrders,
        searchAllOrders,
        searchAllOrdersForCSVExport,
        fetchAllOrdersForCSVExport
    };
};