// controllers/reportController.js
const db = require('../db'); // db connection exported by db.js flow
const clients = require('../services/remoteClients');

function insertOrUpdateOrderReport(orderReport, cb) {

  db.query('SELECT id FROM orders_reports WHERE order_id = ?', [orderReport.order_id], (err, rows) => {
    if (err) return cb(err);
    if (rows.length > 0) {
      const id = rows[0].id;
      db.query('UPDATE orders_reports SET total_revenue=?, total_cost=?, total_profit=?, updated_at=NOW() WHERE id=?',
        [orderReport.total_revenue, orderReport.total_cost, orderReport.total_profit, id], (err) => cb(err, { id }));
    } else {
      db.query('INSERT INTO orders_reports (order_id, total_revenue, total_cost, total_profit) VALUES (?, ?, ?, ?)',
        [orderReport.order_id, orderReport.total_revenue, orderReport.total_cost, orderReport.total_profit], (err, result) => {
          if (err) return cb(err);
          cb(null, { id: result.insertId });
        });
    }
  });
}

function insertOrUpdateProductReport(productReport, cb) {
 
  db.query('INSERT INTO product_reports (order_report_id, product_id, total_sold, revenue, cost, profit) VALUES (?, ?, ?, ?, ?, ?)',
    [productReport.order_report_id, productReport.product_id, productReport.total_sold, productReport.revenue, productReport.cost, productReport.profit],
    (err, result) => {
      if (err) return cb(err);
      cb(null, { id: result.insertId });
    });
}

exports.getAllOrderReports = (req, res) => {
  db.query('SELECT * FROM orders_reports ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getOrderReportById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM orders_reports WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'Order report not found' });
    res.json(rows[0]);
  });
};

exports.deleteOrderReport = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM orders_reports WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted', affected: result.affectedRows });
  });
};

exports.getAllProductReports = (req, res) => {
  db.query('SELECT * FROM product_reports ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getProductReportById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM product_reports WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'Product report not found' });
    res.json(rows[0]);
  });
};

exports.deleteProductReport = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM product_reports WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted', affected: result.affectedRows });
  });
};


exports.createOrdersReports = async (req, res) => {
  try {
    const { order_id } = req.body || {};
    const orders = [];

    if (order_id) {
      
      const order = await clients.fetchOrderById(order_id);
      
      if (Array.isArray(order)) orders.push(...order);
      else orders.push(order);
    } else {
      const allOrders = await clients.fetchAllOrders();
      
      for (const o of allOrders) {
        const od = await clients.fetchOrderById(o.id);
        
        orders.push(od);
      }
    }

    const createdReports = [];

    for (const ord of orders) {
      
      let orderObj = ord;
      let items = [];
      if (ord.order && ord.items) {
        orderObj = ord.order;
        items = ord.items;
      } else if (Array.isArray(ord) && ord.length > 0 && ord[0].order_id) {
        
        orderObj = ord[0];
        items = ord;
      } else if (ord.items) {
        items = ord.items;
      } else {
       
        items = ord.items || [];
      }

      
      const total_revenue = items.reduce((s, it) => s + (parseFloat(it.total_price || (it.quantity * it.unit_price || 0)) || 0), 0);
      
      let total_cost = 0;
      for (const it of items) {
        try {
          const product = await clients.fetchProductById(it.product_id);
          const costPerUnit = parseFloat(product.price || 0);
          total_cost += costPerUnit * (it.quantity || 0);
        } catch (e) {
          
          total_cost += parseFloat(it.unit_price || 0) * (it.quantity || 0);
        }
      }
      const total_profit = total_revenue - total_cost;

      const orderReport = {
        order_id: orderObj.id || orderObj.order_id || orderObj.orderId,
        total_revenue: total_revenue.toFixed(2),
        total_cost: total_cost.toFixed(2),
        total_profit: total_profit.toFixed(2)
      };

      
      const inserted = await new Promise((resolve, reject) => {
        insertOrUpdateOrderReport(orderReport, (err, r) => {
          if (err) reject(err);
          else resolve({ id: r.id, orderReport });
        });
      });

      
      for (const it of items) {
        const product_id = it.product_id;
        const qty = parseInt(it.quantity || 0);
        const revenue = parseFloat(it.total_price || (it.quantity * it.unit_price || 0)) || 0;
        let cost = 0;
        try {
          const product = await clients.fetchProductById(product_id);
          const costUnit = parseFloat(product.price || 0);
          cost = costUnit * qty;
        } catch (e) {
          cost = parseFloat(it.unit_price || 0) * qty;
        }
        const profit = revenue - cost;
        const productReport = {
          order_report_id: inserted.id,
          product_id,
          total_sold: qty,
          revenue: revenue.toFixed(2),
          cost: cost.toFixed(2),
          profit: profit.toFixed(2)
        };
        await new Promise((resolve, reject) => {
          insertOrUpdateProductReport(productReport, (err, r) => {
            if (err) reject(err);
            else resolve(r);
          });
        });
      }

      createdReports.push(inserted);
    }

    res.json({ message: 'Orders reports created/updated', reports: createdReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.createProductsReports = async (req, res) => {
  try {
    
    const products = await clients.fetchAllProducts(); 
    const allOrders = await clients.fetchAllOrders(); 
    const allOrderDetails = [];
    for (const o of allOrders) {
      const od = await clients.fetchOrderById(o.id);
      allOrderDetails.push(od);
    }

    
    const productMap = {}; 
    for (const ord of allOrderDetails) {
      
      let items = ord.items || [];
      if (Array.isArray(ord) && ord.length > 0 && ord[0].product_id !== undefined && !ord.items) {
        items = ord;
      } else if (ord.order && ord.items) {
        items = ord.items;
      }
      for (const it of items) {
        const pid = it.product_id;
        const qty = parseInt(it.quantity || 0);
        const revenue = parseFloat(it.total_price || (it.quantity * it.unit_price || 0)) || 0;
        if (!productMap[pid]) productMap[pid] = { total_sold: 0, revenue: 0 };
        productMap[pid].total_sold += qty;
        productMap[pid].revenue += revenue;
      }
    }

    const created = [];
    for (const p of products) {
      const pid = p.id;
      const total_sold = productMap[pid] ? productMap[pid].total_sold : 0;
      const revenue = productMap[pid] ? productMap[pid].revenue : 0;
      const costPerUnit = parseFloat(p.price || 0);
      const cost = costPerUnit * total_sold;
      const profit = revenue - cost;

      const productReport = {
        order_report_id: null,
        product_id: pid,
        total_sold,
        revenue: revenue.toFixed(2),
        cost: cost.toFixed(2),
        profit: profit.toFixed(2)
      };

      const inserted = await new Promise((resolve, reject) => {
        insertOrUpdateProductReport(productReport, (err, r) => {
          if (err) reject(err);
          else resolve(r);
        });
      });
      created.push({ id: inserted.id, product_id: pid });
    }

    res.json({ message: 'Product reports created', created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
