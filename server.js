// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


require('./db'); 

const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/reports', reportRoutes);

app.get('/', (req, res) => res.send('Report Service running'));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(` Report Service listening on port ${PORT}`);
});
