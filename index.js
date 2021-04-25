'use strict';

const port = 8010;

const { dbCreateSchema } = require('./src/services/helper');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('./src/app')();

app.db = db
db.serialize(() => {
    dbCreateSchema(db);
    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});