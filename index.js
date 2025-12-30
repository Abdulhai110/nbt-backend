// // index.js
// require('dotenv').config();
// const app = require('./src/app');

// const PORT = process.env.PORT || 5000;

// connectDB()
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => {
//     console.error('Failed to start app:', err);
//     process.exit(1);
//   });
// index.js
// require('dotenv').config();
// const serverless = require('serverless-http');
// const app = require('./src/app');
// const connectDB = require('./src/config/db');

// connectDB()
//   .then(() => console.log('Database connected'))
//   .catch(err => {
//     console.error('Failed to connect DB:', err);
//     process.exit(1);
//   });

// // Export as Vercel serverless function
// module.exports = serverless(app);

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");

// const connectDB = require('./src/config/db.config.js');
// const route = require('./src/routes/index.routes.js');
const app = express();

// CORS configuration
var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
// app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
// connectDB();
connectDB();

// Routes configuration
// app.use('/api/ecommerce-react-apis/v1', route);
app.use('/api/public/tours', require('./src/routes/public/tour.routes'));
app.use('/api/public/destinations', require('./src/routes/public/destination.routes'));
app.use("/api/public/gallery", require("./src/routes/public/gallery.routes"));
app.use("/api/public/auth", require("./src/routes/auth.routes"));

// Default route for the root path
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Nbt.",
  });
});

// Catch-all for any undefined routes
app.use(function (req, res) {
  return res.status(400).send({ message: "Sorry! Route not found" });
});

// Set port and start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
