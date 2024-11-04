require('dotenv').config();
const { setupLiquidator } = require('./liquidator');
const logger = require('./utils/logger');

async function main() {
  try {
    logger.info('Starting FAssets Liquidator...');
    await setupLiquidator();
    logger.info('FAssets Liquidator is running');
  } catch (error) {
    logger.error('Failed to start liquidator:', error);
    process.exit(1);
  }
}

main();