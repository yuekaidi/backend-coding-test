"use strict";

const request = require("supertest");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

const app = require("../src/app")(db);
const buildSchemas = require("../src/schemas");
const should = require("should");

describe("API tests", () => {
	before((done) => {
		db.serialize((err) => {
			if (err) {
				return done(err);
			}

			buildSchemas(db);

			done();
		});
	});

	describe("GET empty /health", () => {
		it("should return health", (done) => {
			request(app)
				.get("/health")
				.expect("Content-Type", /text/)
				.expect(200, done);
		});
	});

	describe("GET /rides Empty", () => {
		it("should return not found error", (done) => {
			request(app)
				.get("/rides")
				.expect("Content-Type", /json/)
				.expect(200)
				.expect((res) => should.equal(res.body.error_code, "RIDES_NOT_FOUND_ERROR"))
				.end(done);
		});
	});

	describe("POST /rides", () => {
		it("should return start latitude validation error", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 91,
					"start_long": 0,
					"end_lat": 30,
					"end_long": 60,
					"rider_name": "Amy",
					"driver_name": "Bob",
					"driver_vehicle": "car",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.expect((res) => should.equal(res.body.error_code, "VALIDATION_ERROR"))
				.end(done);
		});

		it("should return start longitude validation error", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 0,
					"start_long": 181,
					"end_lat": 30,
					"end_long": 60,
					"rider_name": "Amy",
					"driver_name": "Bob",
					"driver_vehicle": "car",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.expect((res) => should.equal(res.body.error_code, "VALIDATION_ERROR"))
				.end(done);
		});

		it("should return end longitude validation error", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 0,
					"start_long": 0,
					"end_lat": -91,
					"end_long": 60,
					"rider_name": "Amy",
					"driver_name": "Bob",
					"driver_vehicle": "car",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.expect((res) => should.equal(res.body.error_code, "VALIDATION_ERROR"))
				.end(done);
		});

		it("should return end longitude validation error", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 0,
					"start_long": 0,
					"end_lat": 30,
					"end_long": -181,
					"rider_name": "Amy",
					"driver_name": "Bob",
					"driver_vehicle": "car",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.expect((res) => should.equal(res.body.error_code, "VALIDATION_ERROR"))
				.end(done);
		});

		it("should return rider name validation error", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 0,
					"start_long": 0,
					"end_lat": 30,
					"end_long": 60,
					"rider_name": "",
					"driver_name": "Bob",
					"driver_vehicle": "car",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.expect((res) => should.equal(res.body.error_code, "VALIDATION_ERROR"))
				.end(done);
		});

		it("should return driver name validation error", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 0,
					"start_long": 0,
					"end_lat": 30,
					"end_long": 60,
					"rider_name": "Amy",
					"driver_name": {},
					"driver_vehicle": "car",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.expect((res) => should.equal(res.body.error_code, "VALIDATION_ERROR"))
				.end(done);
		});

		it("should return driver vehicle validation error", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 0,
					"start_long": 0,
					"end_lat": 30,
					"end_long": 60,
					"rider_name": "Amy",
					"driver_name": "Bob",
					"driver_vehicle": [],
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.expect((res) => should.equal(res.body.error_code, "VALIDATION_ERROR"))
				.end(done);
		});

		it("should return added ride", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 0,
					"start_long": 0,
					"end_lat": 30,
					"end_long": 60,
					"rider_name": "Amy",
					"driver_name": "Bob",
					"driver_vehicle": "car",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.expect((res) => should.exist(res.body[0].rideID))
				.end(done);
		});
	});

	describe("GET /rides", () => {
		it("should return all rides", (done) => {
			request(app)
				.get("/rides")
				.expect(200)
				.expect((res) => res.body.should.have.size(1))
				.end(done);
		});

		it("should return more rides after insert", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 0,
					"start_long": 0,
					"end_lat": 30,
					"end_long": 60,
					"rider_name": "Amy",
					"driver_name": "Bob",
					"driver_vehicle": "car",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.then((res) => {
					request(app)
						.get("/rides")
						.expect(200)
						.expect((res) => res.body.should.have.size(2))
						.end(done);
				});
		});
	});

	describe("GET /rides/{id}", () => {
		it("should return not found ride", (done) => {
			request(app)
				.get("/rides")
				.expect("Content-Type", /json/)
				.expect(200)
				.then((res) => {
					request(app)
						.get(`/rides/${res.body.length + 1}`)
						.expect(200)
						.expect((res) => should.equal(res.body.error_code, "RIDES_NOT_FOUND_ERROR"))
						.end(done);
				});
		});

		it("should return added ride", (done) => {
			request(app)
				.post("/rides")
				.set("Content-Type", "application/json")
				.send({
					"start_lat": 0,
					"start_long": 0,
					"end_lat": 30,
					"end_long": 60,
					"rider_name": "Amy",
					"driver_name": "Bob",
					"driver_vehicle": "car",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.then((res) => {
					request(app)
						.get(`/rides/${res.body[0].rideID}`)
						.expect(200)
						.expect((res) => res.body.should.have.size(1))
						.end(done);
				});
		});
	});

	describe("GET /rides Pagination", () => {
		for (var i = 0; i < 10; i++) {
			it(`insert test entry ${i}`, (done) => {
				request(app)
					.post("/rides")
					.set("Content-Type", "application/json")
					.send({
						"start_lat": 0,
						"start_long": 0,
						"end_lat": 30,
						"end_long": 60,
						"rider_name": "Amy",
						"driver_name": "Bob",
						"driver_vehicle": "car",
					})
					.expect("Content-Type", /json/)
					.expect(200, done);
				});
		}
		it('should return current pagination error', (done) => {
			request(app)
			.get("/rides?current=abc")
			.expect(200)
			.expect((res) => should.equal(res.body.error_code, "PAGINATION_ERROR"))
			.end(done);
		})
		it('should return current pagination error', (done) => {
			request(app)
			.get("/rides?current=0")
			.expect(200)
			.expect((res) => should.equal(res.body.error_code, "PAGINATION_ERROR"))
			.end(done);
		})
		it('should return pageSize pagination error', (done) => {
			request(app)
			.get("/rides?pageSize=abc")
			.expect(200)
			.expect((res) => should.equal(res.body.error_code, "PAGINATION_ERROR"))
			.end(done);
		})
		it('should return pageSize pagination error', (done) => {
			request(app)
			.get("/rides?pageSize=0")
			.expect(200)
			.expect((res) => should.equal(res.body.error_code, "PAGINATION_ERROR"))
			.end(done);
		})
		it('should return 10 entries', (done) => {
			request(app)
			.get("/rides?current=1")
			.expect(200)
			.expect((res) => res.body.should.have.size(10))
			.end(done);
		})
		it('should return lte 10 entries', (done) => {
			request(app)
			.get("/rides?current=2")
			.expect(200)
			.expect((res) => res.body.length.should.belowOrEqual(10))
			.end(done);
		})
		it('should return pagination error', (done) => {
			request(app)
			.get("/rides?current=3&pageSize=10")
			.expect(200)
			.expect((res) => should.equal(res.body.error_code, "PAGINATION_ERROR"))
			.end(done);
		})
		it('should return lte 5 entries', (done) => {
			request(app)
			.get("/rides?pageSize=5")
			.expect(200)
			.expect((res) => res.body.should.have.size(5))
			.end(done);
		})
	});
});
