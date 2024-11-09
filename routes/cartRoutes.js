const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add product to cart
router.post('/add', cartController.addToCart);

// Update product quantity in cart
router.put('/update', cartController.updateCart);

// Delete product from cart
router.delete('/delete', cartController.deleteFromCart);

// Get cart details
router.get('/:userId', cartController.getCart);

module.exports = router;
