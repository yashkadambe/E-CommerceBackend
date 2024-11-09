// controllers/productController.js
const Product = require('../models/Product'); // assuming you have a Product model

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const newProduct = new Product({ name, description, price, category });
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", productId: newProduct._id });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, category } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            { name, description, price, category }, 
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetches all products from the database
        if (!products.length) {
            return res.status(404).json({ message: 'No products found.' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while retrieving products.' });
    }
};
