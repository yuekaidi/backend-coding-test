"use strict";
const port = 8010;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");
var helmet = require("helmet");
const buildSchemas = require("./src/schemas");

db.serialize(() => {
	buildSchemas(db);

	const app = require("./src/app")(db);

	app.use(helmet());
    
	app.listen(port, () => console.log(`App started and listening on port ${port}`));
});