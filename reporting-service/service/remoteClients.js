// services/remoteClients.js
const axios = require('axios');
require('dotenv').config();

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL; 
const ORDER_URL = process.env.ORDER_SERVICE_URL;     

async function fetchAllProducts() {
  const res = await axios.get(`${PRODUCT_URL}`);
  return res.data;
}

async function fetchProductById(id) {
  const res = await axios.get(`${PRODUCT_URL}/${id}`);
  return res.data;
}

async function fetchAllOrders() {
  const res = await axios.get(`${ORDER_URL}/orders`);
  return res.data;
}


async function fetchOrderById(id) {
  const res = await axios.get(`${ORDER_URL}/orders/${id}`);
  return res.data;
}

module.exports = {
  fetchAllProducts,
  fetchProductById,
  fetchAllOrders,
  fetchOrderById
};
