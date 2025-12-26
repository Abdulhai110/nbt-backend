// // index.js
// require('dotenv').config();
// const app = require('./src/app');
// const connectDB = require('./src/config/db');

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
require('dotenv').config();
const serverless = require('serverless-http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB()
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.error('Failed to connect DB:', err);
    process.exit(1);
  });

// Export as Vercel serverless function
module.exports = serverless(app);
