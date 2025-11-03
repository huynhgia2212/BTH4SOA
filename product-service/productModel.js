import db from '../db.js';

export const ProductModel = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM products', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  create: (product) => {
    const { name, description, price } = product;
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
        [name, description, price], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
    });
  },

  update: (id, product) => {
    const { name, description, price } = product;
    return new Promise((resolve, reject) => {
      db.query('UPDATE products SET name=?, description=?, price=? WHERE id=?',
        [name, description, price, id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM products WHERE id=?', [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};
