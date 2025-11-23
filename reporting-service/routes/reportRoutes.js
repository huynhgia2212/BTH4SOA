// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');

// Orders reports
router.get('/orders', controller.getAllOrderReports);
router.get('/orders/:id', controller.getOrderReportById);
router.post('/orders', controller.createOrdersReports); // body: { order_id? }
router.delete('/orders/:id', controller.deleteOrderReport);

// Product reports
router.get('/products', controller.getAllProductReports);
router.get('/products/:id', controller.getProductReportById);
router.post('/products', controller.createProductsReports);
router.delete('/products/:id', controller.deleteProductReport);

module.exports = router;
