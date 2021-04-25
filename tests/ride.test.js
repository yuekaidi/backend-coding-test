'use strict';
const rewire = require('rewire');

const rideApi = rewire('../src/controllers/ride')

describe("Ride unit tests", () => {
    describe('Test valdateRideIn', () => {
        it('should return start latitude validation error', (done) => {
            const body = {
                "start_lat": 91,
                "start_long": 0,
                "end_lat": 30,
                "end_long": 60,
                "rider_name": "Amy",
                "driver_name": "Bob",
                "driver_vehicle": "car",
            };
            const response = rideApi.__get__('valdateRideIn')(body)
            response.error_code.should.equal('VALIDATION_ERROR')
            response.message.should.equal('Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively')
			done();
        });

		it("should return start longitude validation error", (done) => {
            const body = {
                "start_lat": 0,
                "start_long": 181,
                "end_lat": 30,
                "end_long": 60,
                "rider_name": "Amy",
                "driver_name": "Bob",
                "driver_vehicle": "car",
            };
            const response = rideApi.__get__('valdateRideIn')(body)
            response.error_code.should.equal('VALIDATION_ERROR')
            response.message.should.equal('Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively')
			done();
		});

		it("should return end latitude validation error", (done) => {
            const body = {
                "start_lat": 0,
                "start_long": 0,
                "end_lat": -91,
                "end_long": 60,
                "rider_name": "Amy",
                "driver_name": "Bob",
                "driver_vehicle": "car",
            };
            const response = rideApi.__get__('valdateRideIn')(body)
            response.error_code.should.equal('VALIDATION_ERROR')
            response.message.should.equal('End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively')
			done();
		});

		it("should return end longitude validation error", (done) => {
            const body = {
                "start_lat": 0,
                "start_long": 0,
                "end_lat": 30,
                "end_long": -181,
                "rider_name": "Amy",
                "driver_name": "Bob",
                "driver_vehicle": "car",
            };
            const response = rideApi.__get__('valdateRideIn')(body)
            response.error_code.should.equal('VALIDATION_ERROR')
            response.message.should.equal('End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively')
			done();
		});

		it("should return rider name validation error", (done) => {
            const body = {
                "start_lat": 0,
                "start_long": 0,
                "end_lat": 30,
                "end_long": 60,
                "rider_name": "",
                "driver_name": "Bob",
                "driver_vehicle": "car",
            };
            const response = rideApi.__get__('valdateRideIn')(body)
            response.error_code.should.equal('VALIDATION_ERROR')
            response.message.should.equal('Rider name must be a non empty string')
			done();
		});

		it("should return driver name validation error", (done) => {
			const body = {
                "start_lat": 0,
                "start_long": 0,
                "end_lat": 30,
                "end_long": 60,
                "rider_name": "Amy",
                "driver_name": {},
                "driver_vehicle": "car",
            };
            const response = rideApi.__get__('valdateRideIn')(body)
            response.error_code.should.equal('VALIDATION_ERROR')
            response.message.should.equal('Driver name must be a non empty string')
			done();
		});

		it("should return driver vehicle validation error", (done) => {
			const body = {
                "start_lat": 0,
                "start_long": 0,
                "end_lat": 30,
                "end_long": 60,
                "rider_name": "Amy",
                "driver_name": "Bob",
                "driver_vehicle": [],
            };
            const response = rideApi.__get__('valdateRideIn')(body)
            response.error_code.should.equal('VALIDATION_ERROR')
            response.message.should.equal('Driver vehicle must be a non empty string')
			done();
		});
	});
    describe('Test valdatePageination', () => {
        it('should return current page pagination error', (done) => {
            const current = 'abc'
            const pageSize = 10
            const response = rideApi.__get__('valdatePageination')(current, pageSize)
            response.error_code.should.equal('PAGINATION_ERROR')
            response.message.should.equal('Current page number must be a natrual number (integer bigger than 0)')
			done();
        });
        it('should return current page pagination error', (done) => {
            const current = 0
            const pageSize = 10
            const response = rideApi.__get__('valdatePageination')(current, pageSize)
            response.error_code.should.equal('PAGINATION_ERROR')
            response.message.should.equal('Current page number must be a natrual number (integer bigger than 0)')
			done();
        });
        it('should return page size pagination error', (done) => {
            const current = 1
            const pageSize = 'abc'
            const response = rideApi.__get__('valdatePageination')(current, pageSize)
            response.error_code.should.equal('PAGINATION_ERROR')
            response.message.should.equal('Page size must be a natrual number (integer bigger than 0)')
			done();
        });
        it('should return page size pagination error', (done) => {
            const current = 1
            const pageSize = 0
            const response = rideApi.__get__('valdatePageination')(current, pageSize)
            response.error_code.should.equal('PAGINATION_ERROR')
            response.message.should.equal('Page size must be a natrual number (integer bigger than 0)')
			done();
        });
	});
});

