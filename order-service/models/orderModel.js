const db = require("../db");

const createTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      total_price DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(sql, err => {
    if (err) throw err;
    console.log("🗂️ Table 'orders' ready.");
  });
};

const Order = {
  getAll: callback => {
    db.query("SELECT * FROM orders", callback);
  },
  getById: (id, callback) => {
    db.query("SELECT * FROM orders WHERE id = ?", [id], callback);
  },
  create: (data, callback) => {
    db.query("INSERT INTO orders SET ?", data, callback);
  },
  delete: (id, callback) => {
    db.query("DELETE FROM orders WHERE id = ?", [id], callback);
  }
};

createTable();
module.exports = Order;
