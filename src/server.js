const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const { setupLiquidator } = require('./liquidator');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// API endpoints
app.get('/api/stats', (req, res) => {
  const stats = global.liquidator?.rewardsTracker.getDailyStats() || { today: '0', total: '0' };
  res.json(stats);
});

// WebSocket events for real-time updates
io.on('connection', (socket) => {
  logger.info('Client connected');
  socket.on('disconnect', () => logger.info('Client disconnected'));
});

// Start the liquidator
async function startLiquidator() {
  try {
    global.liquidator = await setupLiquidator();
    
    // Emit liquidation events to connected clients
    global.liquidator.on('liquidation', (data) => {
      io.emit('liquidation', data);
    });
    
    // Emit stats updates every minute
    setInterval(() => {
      const stats = global.liquidator.rewardsTracker.getDailyStats();
      io.emit('stats', stats);
    }, 60000);
    
  } catch (error) {
    logger.error('Failed to start liquidator:', error);
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  startLiquidator();
});