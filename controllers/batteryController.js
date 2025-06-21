const Battery = require('../models/battery');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

 exports.postBatteryData = async (req, res, next) => {
   console.log('--- Inside postBatteryData controller ---');
  console.log('Request URL:', req.url);
  console.log('Original URL:', req.originalUrl);
  console.log('Request Query:', req.query);
  console.log('Request Body:', req.body);
  console.log('-----------------------------------------');

  try {
    // --- THIS IS THE LINE WE ARE RE-INTRODUCING ---
    const newBatteryData = await Battery.create(req.body);

    logger.info(`Battery data stored successfully: ${newBatteryData.battery_id}`);
    res.status(201).json(newBatteryData); // Send 201 Created on success

  } catch (err) {
    // IMPORTANT: Log the FULL error object here
    console.error('Error caught in postBatteryData controller (from model/DB):', err);
    logger.error(`Error storing battery data: ${err.message}`, err);
    next({ statusCode: 500, message: 'Could not store battery data', errors: [{ msg: err.message }] });
  }
 };

// exports.postBatteryData = (req, res, next) => { // You can even make it non-async for this test

//   console.log('--- Inside postBatteryData controller ---');
//   console.log('Request URL:', req.url);
//   console.log('Original URL:', req.originalUrl);
//   console.log('Request Query:', req.query);
//   console.log('Request Body:', req.body);
//   console.log('-----------------------------------------');

//   // TEMPORARY: Just send a success response immediately
//   logger.info('Simulated POST request received successfully.');
//   return res.status(200).json({
//     message: "Controller hit successfully, database call bypassed for testing.",
//     received_data: req.body // Show what was received
//   });

//   // No try/catch needed for this simple test, as we're not doing anything that should throw
//   // The original try/catch will still be there in the real code
// };

exports.getBatteryDataById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const batteryData = await Battery.findByBatteryId(id);

    if (batteryData.length === 0) {
      logger.info(`No data found for battery ID: ${id}`);
      return res.status(404).json({ msg: 'No data found for this battery ID' });
    }

    logger.info(`Retrieved all data for battery ID: ${id}`);
    res.status(200).json(batteryData);
  } catch (err) {
    logger.error(`Error retrieving battery data for ID ${req.params.id}: ${err.message}`, err);
    next({ statusCode: 500, message: 'Could not retrieve battery data', errors: [{ msg: err.message }] });
  }
};

exports.getBatteryFieldById = async (req, res, next) => {
  try {
    const { id, field } = req.params;
    const batteryFieldData = await Battery.findFieldByBatteryId(id, field);

    if (batteryFieldData.length === 0) {
      logger.info(`No data found for battery ID: ${id} and field: ${field}`);
      return res.status(404).json({ msg: `No data found for battery ID: ${id} and field: ${field}` });
    }

    logger.info(`Retrieved ${field} data for battery ID: ${id}`);
    res.status(200).json(batteryFieldData);
  } catch (err) {
    logger.error(`Error retrieving battery field data for ID ${req.params.id}, field ${req.params.field}: ${err.message}`, err);
    next({ statusCode: 500, message: 'Could not retrieve specific battery field data', errors: [{ msg: err.message }] });
  }
};

exports.getBatteryFieldByIdAndTimeRange = async (req, res, next) => {
  try {
    const { id, field } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
      logger.warn(`Missing start or end time for query: ${req.originalUrl}`);
      return res.status(400).json({ msg: 'Start and end time parameters are required' });
    }

    const batteryFieldData = await Battery.findFieldByBatteryIdAndTimeRange(id, field, start, end);

    if (batteryFieldData.length === 0) {
      logger.info(`No data found for battery ID: ${id}, field: ${field}, between ${start} and ${end}`);
      return res.status(404).json({ msg: `No data found for the specified criteria` });
    }

    logger.info(`Retrieved ${field} data for battery ID: ${id} between ${start} and ${end}`);
    res.json(batteryFieldData);
  } catch (err) {
    logger.error(`Error retrieving battery field data by time range for ID ${req.params.id}, field ${req.params.field}: ${err.message}`, err);
    next({ statusCode: 500, message: 'Could not retrieve specific battery field data by time range', errors: [{ msg: err.message }] });
  }
};

exports.getBatteryDataByTemperatureRange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { minTemp, maxTemp } = req.query;

    if (!minTemp || !maxTemp) {
      logger.warn(`Missing minTemp or maxTemp for query: ${req.originalUrl}`);
      return res.status(400).json({ msg: 'minTemp and maxTemp query parameters are required' });
    }

    const batteryData = await Battery.findByBatteryIdAndTemperatureRange(id, parseFloat(minTemp), parseFloat(maxTemp));

    if (batteryData.length === 0) {
      logger.info(`No data found for battery ID: ${id} with temperature between ${minTemp} and ${maxTemp}`);
      return res.status(404).json({ msg: `No data found for the specified temperature range` });
    }

    logger.info(`Retrieved data for battery ID: ${id} with temperature between ${minTemp} and ${maxTemp}`);
    res.json(batteryData);
  } catch (err) {
    logger.error(`Error retrieving battery data by temperature range for ID ${req.params.id}: ${err.message}`, err);
    next({ statusCode: 500, message: 'Could not retrieve battery data by temperature range', errors: [{ msg: err.message }] });
  }
};