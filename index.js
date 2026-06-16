// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const connectDB = require("./src/config/db");
// const app = require('./src/app');

// connectDB();

// // Catch-all for any undefined routes
// app.use(function (req, res) {
//   return res.status(400).send({ message: "Sorry! Route not found" });
// });

// // Set port and start server
// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

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