const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../utils/logger'); // Assuming you have a logger

module.exports = function (req, res, next) {
    console.log('--- Auth Middleware Executing ---'); // Add this line
    // Get token from header
    const token = req.header('x-auth-token'); // Or Authorization header if you changed it

    // Check if no token
    if (!token) {
        logger.warn('No token, authorization denied');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        logger.error('Token is not valid', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};