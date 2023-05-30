const { Pool } = require("pg");
require("dotenv").config()
// const db = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "kimi",
//   database: "sosmed",
//   port: 5432
// });

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

module.exports = db;
