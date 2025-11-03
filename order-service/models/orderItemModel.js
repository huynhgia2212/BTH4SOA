const db = require("../db");

const createTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_name VARCHAR(255),
      price DECIMAL(10,2),
      quantity INT,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `;
  db.query(sql, err => {
    if (err) throw err;
    console.log(" Table 'order_items' ready.");
  });
};

const OrderItem = {
  getAll: callback => {
    db.query("SELECT * FROM order_items", callback);
  },
  getByOrderId: (order_id, callback) => {
    db.query("SELECT * FROM order_items WHERE order_id = ?", [order_id], callback);
  },
  create: (data, callback) => {
    db.query("INSERT INTO order_items SET ?", data, callback);
  }
};

createTable();
module.exports = OrderItem;
