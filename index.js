"use strict";
const port = 8010;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");
const buildSchemas = require("./src/schemas");
const helmet = require("helmet");
const cors = require('cors')

var corsOptions = {
    origin: "http://localhost:8010"
  }

db.serialize(() => {
	buildSchemas(db);

	const app = require("./src/app")(db);

	app.use(helmet());
    app.use(cors(corsOptions))
    
	app.listen(port, () => console.log(`App started and listening on port ${port}`));
});