"use strict";

let locationsModel = app.models.locations;

describe("Client model test", () => {

    describe("Get location data", () => {
        let location_params = {
            cloud_site_id: 9881
        };

        it("should fetch data for locations", done => {
            locationsModel.fetchLocations(location_params).then(result => {
                expect(result).to.be.a("array");
                done();
            });
        });

    });

});