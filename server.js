// server.js
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

require("dotenv").config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
