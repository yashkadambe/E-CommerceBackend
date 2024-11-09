const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'Email already registered' });
    
    user = new User({ name, email, password, address });
    await user.save();

    res.json({ message: 'Signup successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
