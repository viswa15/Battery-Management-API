const { Pool } = require('pg');
const config = require('config');
const dotenv = require('dotenv');
const logger = require('./logger');

dotenv.config(); // Load environment variables from .env

const dbConfig = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : config.get('database');

console.log('--- DB Config Being Used ---'); // Add this for debugging
console.log(dbConfig);
console.log('----------------------------');

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  logger.info('Connected to the PostgreSQL database.');
});

pool.on('error', (err) => {
  logger.error('Error connecting to the database:', err.message);
  process.exit(1); // Exit process on database connection error
});

module.exports = pool;