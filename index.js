require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/app');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  app(req, res);
};