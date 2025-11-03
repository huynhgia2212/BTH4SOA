const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const orderItemRoutes = require("./routes/orderItemRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/orders", orderRoutes);
app.use("/order-items", orderItemRoutes);

app.get("/", (req, res) => res.send("Order Service is running 🚀"));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(` Order service running on port ${PORT}`);
});
