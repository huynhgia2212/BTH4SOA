const express = require("express");
const router = express.Router();
const orderItemController = require("../controllers/orderItemController");

router.get("/:order_id", orderItemController.getItemsByOrderId);
router.post("/", orderItemController.createOrderItem);

module.exports = router;
