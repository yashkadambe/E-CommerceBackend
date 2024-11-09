const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Place a new order
router.post('/placeorder', orderController.placeOrder);

// Get all orders (Admin access)
router.get('/getallorders', orderController.getAllOrders);

// Get orders by customer ID
router.get('/customer/:customerId', orderController.getOrdersByCustomerId);

module.exports = router;
