// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const connectDB = require("./src/config/db");
// const app = require('./src/app');


// // Catch-all for any undefined routes
// app.use(function (req, res) {
//   return res.status(400).send({ message: "Sorry! Route not found" });
// });

// // Set port and start server
// const PORT = process.env.PORT || 5000;
// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}.`);
//     });
//   })
//   .catch((err) => {
//     console.error('Failed to connect to MongoDB. Server not started.');
//     console.error(err);
//     process.exit(1);
//   });

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