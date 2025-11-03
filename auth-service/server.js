import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import db from './db.js';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Auth Service is running...');
});

app.listen(process.env.PORT, () => {
  console.log(` Auth Service running on port ${process.env.PORT}`);
});
