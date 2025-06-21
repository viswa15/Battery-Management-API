const express = require('express');
const { check, param, query } = require('express-validator');
const router = express.Router();
const batteryController = require('../controllers/batteryController');
const auth = require('../middleware/auth'); // Assuming you want to protect retrieval APIs
const requestLogger = require('../middleware/logger');

// POST /api/battery/data
router.post(
  '/data',
  // No validation middleware here now
  // requestLogger, // <-- COMMENT THIS OUT COMPLETELY OR REMOVE IT
  batteryController.postBatteryData
);

// GET /api/battery/:id
router.get(
  '/:id',
  [
    param('id').notEmpty().withMessage('Battery ID is required')
  ],
  // auth, // Protected route
  requestLogger,
  batteryController.getBatteryDataById
);

// GET /api/battery/:id/:field
router.get(
  '/:id/:field',
  [
    param('id').notEmpty().withMessage('Battery ID is required'),
    param('field').isIn(['current', 'voltage', 'temperature']).withMessage('Field must be current, voltage, or temperature')
  ],
  // auth, // Protected route
  requestLogger,
  batteryController.getBatteryFieldById
);

// GET /api/battery/:id/:field?start=:start&end=:end
router.get(
  '/:id/:field', // This route needs to be before the one above it if parameters are optional in the path
  [
    param('id').notEmpty().withMessage('Battery ID is required'),
    param('field').isIn(['current', 'voltage', 'temperature']).withMessage('Field must be current, voltage, or temperature'),
    query('start').optional().isISO8601().withMessage('Start time must be a valid ISO 8601 timestamp'),
    query('end').optional().isISO8601().withMessage('End time must be a valid ISO 8601 timestamp')
  ],
  // auth, // Protected route
  requestLogger,
  batteryController.getBatteryFieldByIdAndTimeRange // This controller will handle the start/end check
);

// GET /api/battery/:id?minTemp=:minTemp&maxTemp=:maxTemp (Bonus Feature)
router.get(
  '/:id',
  [
    param('id').notEmpty().withMessage('Battery ID is required'),
    query('minTemp').optional().isNumeric().withMessage('minTemp must be a number'),
    query('maxTemp').optional().isNumeric().withMessage('maxTemp must be a number')
  ],
  // auth, // Protected route
  requestLogger,
  batteryController.getBatteryDataByTemperatureRange // This controller will handle the minTemp/maxTemp check
);


module.exports = router;