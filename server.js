const app = require('./app');
const config = require('config');
const logger = require('./utils/logger');
require('./utils/db'); // Ensure database connection is attempted on startup

const PORT = process.env.PORT || config.get('port');

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});