"use strict";

let ordersModel = app.models.orders;

describe("Client model test", () => {

    describe("Get Orders data", () => {
        let client = {
            date_from: "2011-02-21T18:30:00.000Z",
            date_to: "2016-05-06T07:57:43.453Z",
            location_id: 4793,
            cloud_site_id: 9881,
            date_type: "DAY"
        };

        it("should fetch data for Orders", done => {
            ordersModel.fetchOrders(client).then(result => {
                expect(result[0]).to.be.a("array");
                expect(result[1]).to.be.a("array");
                expect(result[2]).to.be.a("array");
                expect(result[3]).to.be.a("array");
                expect(result[4]).to.be.a("array");
                expect(result[5]).to.be.a("array");
                expect(result[6]).to.be.a("array");
                done();
            });
        });

    });

});