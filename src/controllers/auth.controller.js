// src/controllers/auth.controller.js
const User = require('../models/user.model');
const { signToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already used' });

  const user = await User.create({ name, email, password });
  const token = signToken({ id: user._id });
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  console.log(user);
  
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken({ id: user._id });
  res.json({ 
    user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
    token 
  });
};


exports.me = async (req, res) => {
  res.json({ user: req.user });
};
