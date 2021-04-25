/**
 * Initialise DB collection
 * @param {object}  db  db instance
 */
const dbCreateSchema = (db) => {
    const createRideTableSchema = `
        CREATE TABLE Rides
        (
        rideID INTEGER PRIMARY KEY AUTOINCREMENT,
        startLat DECIMAL NOT NULL,
        startLong DECIMAL NOT NULL,
        endLat DECIMAL NOT NULL,
        endLong DECIMAL NOT NULL,
        riderName TEXT NOT NULL,
        driverName TEXT NOT NULL,
        driverVehicle TEXT NOT NULL,
        created DATETIME default CURRENT_TIMESTAMP
     );`
    db.run(createRideTableSchema);
}

/**
 * DB All request Handler
 * @param {object}  db      db instance
 * @param {string}  script  SQL Script
 */
const dbAll = (db, script) => {
    return new Promise((resolve, reject) => {
      db.all(script, function (err, rows) {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  };


/**
 * DB Run request Handler
 * @param {object}  db      db instance
 * @param {string}  script  SQL Script
 * @param {list}    values  values to be inserted into SQL Script
 */
const dbRun = (db, script, values) => {
    return new Promise((resolve, reject) => {
      db.run(script, values, function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      });
    });
  };

module.exports = {
    dbCreateSchema,
    dbAll,
    dbRun
};
