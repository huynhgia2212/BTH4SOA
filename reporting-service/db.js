// db.js
const mysql = require('mysql2');
require('dotenv').config();

const rootConn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || ''
});


rootConn.connect(err => {
  if (err) {
    console.error(' Cannot connect to MySQL root:', err);
    process.exit(1);
  }
  const dbName = process.env.DB_NAME || 'report_db';
  rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err) => {
    if (err) {
      console.error(' Cannot create database:', err);
      process.exit(1);
    }
    
    rootConn.end();
    initAppConnection();
  });
});

function initAppConnection() {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME
  });

  db.connect(err => {
    if (err) {
      console.error(' Cannot connect to report DB:', err);
      process.exit(1);
    }
    console.log(' Connected to report DB');

   
    const ordersReportsSQL = `
      CREATE TABLE IF NOT EXISTS orders_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        total_revenue DECIMAL(14,2) DEFAULT 0,
        total_cost DECIMAL(14,2) DEFAULT 0,
        total_profit DECIMAL(14,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    db.query(ordersReportsSQL, (err) => {
      if (err) console.error(' create orders_reports error:', err);
      else console.log(" Table 'orders_reports' ready");
    });

    
    const productReportsSQL = `
      CREATE TABLE IF NOT EXISTS product_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_report_id INT DEFAULT NULL,
        product_id INT NOT NULL,
        total_sold INT DEFAULT 0,
        revenue DECIMAL(14,2) DEFAULT 0,
        cost DECIMAL(14,2) DEFAULT 0,
        profit DECIMAL(14,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    db.query(productReportsSQL, (err) => {
      if (err) console.error(' create product_reports error:', err);
      else console.log(" Table 'product_reports' ready");
    });
  });

  module.exports = db;
}
