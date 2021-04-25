const dbHelper = require('./helper')

/**
 * DB get all rides
 * @param {object}  db  db instance
 * @return {object[]} List of all rides entries
 */
const dbGetRides = async (db) => {
    return await dbHelper.dbAll(db, "SELECT * FROM Rides")
};


/**
 * DB get all rides
 * @param {object}  db      db instance
 * @param {string}  rideId  id of ride entry
 * @return {object[]} List of rides with id rideId
 */
const dbGetRidesById = async (db, rideId) => {
    return await dbHelper.dbAll(db, `SELECT * FROM Rides WHERE rideID=${rideId}`)
};

/**
 * DB get all rides
 * @param {object}      db      db instance
 * @param {string[]}    values  list of values to be inserted
 * @return {string} incerted ride's rideId
 */
const dbInsertRide = async (db, values) => {
    return await dbHelper.dbRun(db, "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)", values)
};

module.exports = {
    dbGetRides,
    dbGetRidesById,
    dbInsertRide
};
