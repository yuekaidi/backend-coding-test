"use strict";
const dbRide = require('../services/ride');

const addRide = async (req, res) => {
    const validatedData = valdateRideIn(req.body);
    if (validatedData.error_code) {
        res.status(422);
        return res.send(validatedData);
    }

    try {
        const insertedId = await dbRide.dbInsertRide(req.app.db, validatedData.values);
        const rows = await dbRide.dbGetRidesById(req.app.db, insertedId);
        res.send(rows);
    } catch (err) {
        res.status(500);
        return res.send({
            error_code: "SERVER_ERROR",
            message: "Unknown error"
        });
    }
}

const getRides = async (req, res) => {
    const current = Number(req.query.current || '1');
    const pageSize = Number(req.query.pageSize || '10');
    const validatedData = valdatePageination(current, pageSize);
    if (validatedData.error_code) {
        res.status(400);
        return res.send(validatedData);
    }
    console.log(current, pageSize)

    try {
        const rows = await dbRide.dbGetRides(req.app.db);
        if (rows.length < (current - 1) * pageSize) {
            res.status(400);
            return res.send({
                error_code: "PAGINATION_ERROR",
                message: "Page number exceed maximum page number"
            })
        }
        if (rows.length === 0) {
            res.status(404);
            return res.send({
                error_code: "RIDES_NOT_FOUND_ERROR",
                message: "Could not find any rides"
            });
        }

        res.send(rows.slice((current - 1) * pageSize, current * pageSize));
    } catch (err) {
        res.status(500);
        return res.send({
            error_code: "SERVER_ERROR",
            message: "Unknown error"
        });
    }
}

const getRide = async (req, res) => {
    try {
        const rows = await dbRide.dbGetRidesById(req.app.db, req.params.id);
        if (rows.length === 0) {
            res.status(404);
            return res.send({
                error_code: "RIDES_NOT_FOUND_ERROR",
                message: "Could not find any rides"
            });
        }

        res.send(rows);
    }
    catch (err) {
        res.status(500);
        return res.send({
            error_code: "SERVER_ERROR",
            message: "Unknown error"
        });
    }
}

const valdateRideIn = (rideData) => {
    const startLatitude = Number(rideData.start_lat);
    const startLongitude = Number(rideData.start_long);
    const endLatitude = Number(rideData.end_lat);
    const endLongitude = Number(rideData.end_long);
    const riderName = rideData.rider_name;
    const driverName = rideData.driver_name;
    const driverVehicle = rideData.driver_vehicle;

    if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
        return {
            error_code: "VALIDATION_ERROR",
            message: "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
        };
    }
    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
        return {
            error_code: "VALIDATION_ERROR",
            message: "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
        };
    }

    if (typeof riderName !== "string" || riderName.length < 1) {
        return {
            error_code: "VALIDATION_ERROR",
            message: "Rider name must be a non empty string"
        };
    }

    if (typeof driverName !== "string" || driverName.length < 1) {
        return {
            error_code: "VALIDATION_ERROR",
            message: "Driver name must be a non empty string"
        };
    }

    if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
        return {
            error_code: "VALIDATION_ERROR",
            message: "Driver vehicle must be a non empty string"
        };
    }

    const values = [rideData.start_lat, rideData.start_long, rideData.end_lat, rideData.end_long, riderName, driverName, driverVehicle]
    return {values: values}
}

const valdatePageination = (current, pageSize) => {
    if (!Number.isInteger(current) || current < 1) {
        return {
            error_code: "PAGINATION_ERROR",
            message: "Current page number must be a natrual number (integer bigger than 0)"
        }
    }

    if (!Number.isInteger(pageSize) || pageSize < 1 ) {
        return {
            error_code: "PAGINATION_ERROR",
            message: "Page size must be a natrual number (integer bigger than 0)"
        }
    }
    return {}
}

module.exports = {
	addRide,
    getRides,
    getRide
}