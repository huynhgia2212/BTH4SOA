import db from '../db.js';
import bcrypt from 'bcrypt';

export const UserModel = {
  create: async (username, password) => {
    const hashed = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }
};
