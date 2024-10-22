/** Database setup for Biztime. */
require("dotenv").config();

const { Client } = require("pg");

let db = new Client({
    connectionString: `postgres://paulo:P@ulo445@localhost:5432/biztime`
  });
  

db.connect();

module.exports = db;