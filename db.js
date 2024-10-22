/** Database setup for Biztime. */
require("dotenv").config();

const { Client } = require("pg");

let db = new Client({
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  });
  

db.connect();

module.exports = db;