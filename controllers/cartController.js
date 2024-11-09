const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Validate userId, productId, and quantity
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid or missing product ID' });
  }
  if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be a positive number' });
  }

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      // Check if the product is already in the cart
      const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (existingItemIndex !== -1) {
        // Update the quantity if the product exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add the product to the cart if it does not exist
        cart.items.push({ productId, quantity });
      }
    }

    // Save the cart and return the updated cart
    await cart.save();
    res.json({ message: 'Product added to cart', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Validate input data
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid or missing product ID' });
  }
  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be zero or a positive number' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ error: 'Product not found in cart' });

    if (quantity === 0) {
      // Remove product from cart if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Update product quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  // Validate input data
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid or missing product ID' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ error: 'Product not found in cart' });

    // Remove product from cart
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.json({ message: 'Product removed from cart', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price');
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.productId.price * item.quantity;
    });

    res.json({ cart, totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
