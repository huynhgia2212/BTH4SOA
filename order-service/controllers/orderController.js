const Order = require("../models/orderModel");

exports.getAllOrders = (req, res) => {
  Order.getAll((err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.getOrderById = (req, res) => {
  const id = req.params.id;
  Order.getById(id, (err, results) => {
    if (err) throw err;
    if (results.length === 0)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(results[0]);
  });
};

exports.createOrder = (req, res) => {
  const { product_id, quantity, total_price } = req.body;
  if (!product_id || !quantity || !total_price)
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  const newOrder = { product_id, quantity, total_price };
  Order.create(newOrder, (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, message: "Đã tạo đơn hàng" });
  });
};

exports.deleteOrder = (req, res) => {
  const id = req.params.id;
  Order.delete(id, (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json({ message: "Đã xóa đơn hàng" });
  });
};
