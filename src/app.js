"use strict";
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const healthApi = require('./controllers/health')
const rideApi = require('./controllers/ride')

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = (db) => {
	// Health
	app.get("/health", healthApi.get);

	// Rides
	app.post("/rides", jsonParser, rideApi.addRide);
	app.get("/rides", rideApi.getRides);
	app.get("/rides/:id", rideApi.getRide);

	return app;
};
