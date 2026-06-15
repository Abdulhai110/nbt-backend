require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/app');

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    app(req, res);
  } catch (err) {
    console.error('CRASH:', err); // This will show in Vercel logs
    res.status(500).json({ error: err.message }); // Shows error in browser too
  }
};