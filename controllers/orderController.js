const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
  const { userId, shippingAddress } = req.body;

  try {
    // Retrieve the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    // Create a new order from the cart items
    const orderItems = [];
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ error: 'Product not found' });

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
      });
    }

    const order = new Order({
      userId,
      products: orderItems,
      shippingAddress,
    });

    await order.save();

    // Optionally, empty the cart after placing the order
    cart.items = [];
    await cart.save();

    res.json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId').exec();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOrdersByCustomerId = async (req, res) => {
  const { customerId } = req.params;

  try {
    const orders = await Order.find({ userId: customerId }).populate('products.productId').exec();
    if (orders.length === 0) return res.status(404).json({ error: 'No orders found for this customer' });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
