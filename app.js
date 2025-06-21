const express = require('express');
const cors = require('cors');
const batteryRoutes = require('./routes/batteryRoute');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger'); // For initial app setup logging

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true })); 
app.use(cors());         // Enable CORS

// Routes
app.use('/api/battery', batteryRoutes);

// Catch-all for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;