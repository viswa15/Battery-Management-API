const pool = require('../utils/db');
const moment = require('moment'); // For robust date parsing/formatting

const Battery = {
  async create(data) {
    console.log('--- Inside Battery.create model function ---');
    console.log('Data received by model:', data);

    const { battery_id, current, voltage, temperature, time } = data;

    // Verify destructured values
    console.log('Destructured values:', { battery_id, current, voltage, temperature, time });

    

    const query = `
      INSERT INTO battery_data (battery_id, current, voltage, temperature, timestamp)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [battery_id, current, voltage, temperature, moment.utc(time).toISOString()];

    console.log('SQL Query:', query);
    console.log('SQL Values:', values);

    try {
      console.log('Attempting to execute pool.query...');
      const { rows } = await pool.query(query, values); // <--- ERROR LIKELY OCCURS ON OR AROUND THIS LINE
      console.log('Pool query executed successfully.');
      return rows[0];
    } catch (dbError) {
      // IMPORTANT: Log the FULL database error object here
      console.error('Error executing database query in Battery.create:', dbError);
      // Re-throw the error so the controller can catch it and send a 500
      throw dbError;
    }
  },

  async findByBatteryId(batteryId) {
    const query = `SELECT * FROM battery_data WHERE battery_id = $1 ORDER BY timestamp ASC;`;
    const { rows } = await pool.query(query, [batteryId]);
    return rows;
  },

  async findFieldByBatteryId(batteryId, field) {
    // Validate field to prevent SQL injection
    const allowedFields = ['current', 'voltage', 'temperature'];
    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid field: ${field}`);
    }
    const query = `SELECT timestamp, ${field} FROM battery_data WHERE battery_id = $1 ORDER BY timestamp ASC;`;
    const { rows } = await pool.query(query, [batteryId]);
    return rows;
  },

  async findFieldByBatteryIdAndTimeRange(batteryId, field, startTime, endTime) {
    // Validate field to prevent SQL injection
    const allowedFields = ['current', 'voltage', 'temperature'];
    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid field: ${field}`);
    }

    const query = `
      SELECT timestamp, ${field}
      FROM battery_data
      WHERE battery_id = $1
      AND timestamp BETWEEN $2 AND $3
      ORDER BY timestamp ASC;
    `;
    const values = [batteryId, moment.utc(startTime).toISOString(), moment.utc(endTime).toISOString()];
    const { rows } = await pool.query(query, values);
    return rows;
  },

  async findByBatteryIdAndTemperatureRange(batteryId, minTemp, maxTemp) {
    const query = `
      SELECT *
      FROM battery_data
      WHERE battery_id = $1
      AND temperature BETWEEN $2 AND $3
      ORDER BY timestamp ASC;
    `;
    const values = [batteryId, minTemp, maxTemp];
    const { rows } = await pool.query(query, values);
    return rows;
  }
};

module.exports = Battery;