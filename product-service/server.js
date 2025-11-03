import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.js';
import db from './db.js';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Product Service is running...');
});

app.listen(process.env.PORT, () => {
  console.log(` Product Service running on port ${process.env.PORT}`);
});
