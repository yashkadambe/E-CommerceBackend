const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); // Ensure this path is correct

// Add product route
router.post('/addproduct', productController.addProduct);

// Update product route
router.put('/updateproduct/:productId', productController.updateProduct);

// Delete product route
router.delete('/deleteproduct/:productId', productController.deleteProduct);

// Get all products route
router.get('/products', productController.getAllProducts);

module.exports = router;
