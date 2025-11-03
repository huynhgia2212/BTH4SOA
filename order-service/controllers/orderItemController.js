const OrderItem = require("../models/orderItemModel");

exports.getItemsByOrderId = (req, res) => {
  const order_id = req.params.order_id;
  OrderItem.getByOrderId(order_id, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.createOrderItem = (req, res) => {
  const { order_id, product_name, price, quantity } = req.body;
  if (!order_id || !product_name || !price || !quantity)
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  const newItem = { order_id, product_name, price, quantity };
  OrderItem.create(newItem, (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, message: "Đã thêm sản phẩm vào đơn hàng" });
  });
};
