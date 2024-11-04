const fs = require('fs').promises;
const logger = require('./logger');

async function loadSecrets() {
  try {
    const data = await fs.readFile('secrets.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Failed to load secrets:', error);
    throw new Error('Failed to load secrets. Make sure secrets.json exists and is properly configured.');
  }
}

module.exports = {
  loadSecrets
};