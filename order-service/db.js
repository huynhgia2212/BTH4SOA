const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

connection.connect(err => {
  if (err) throw err;
  console.log(" Connected to MySQL (order-service)");
  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, err => {
    if (err) throw err;
    console.log(` Database '${process.env.DB_NAME}' ready.`);
  });
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to order_db");
});

module.exports = db;
