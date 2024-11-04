const ethers = require('ethers');
const logger = require('../utils/logger');

class RewardsTracker {
  constructor() {
    this.dailyRewards = new Map();
    this.totalRewards = ethers.BigNumber.from(0);
  }

  async trackLiquidationReward(agentAddress, liquidationAmount, premium) {
    const reward = this.calculateReward(liquidationAmount, premium);
    const date = new Date().toISOString().split('T')[0];
    
    // Track daily rewards
    const dailyReward = this.dailyRewards.get(date) || ethers.BigNumber.from(0);
    this.dailyRewards.set(date, dailyReward.add(reward));
    
    // Update total rewards
    this.totalRewards = this.totalRewards.add(reward);

    // Log the earnings
    logger.info(`Earned ${ethers.utils.formatEther(reward)} CFLR from liquidating ${agentAddress}`);
    logger.info(`Total rewards today: ${ethers.utils.formatEther(this.dailyRewards.get(date))} CFLR`);
    logger.info(`All-time rewards: ${ethers.utils.formatEther(this.totalRewards)} CFLR`);
  }

  calculateReward(liquidationAmount, premium) {
    // Premium is usually 10-20% above the liquidation amount
    return liquidationAmount.mul(premium).div(100);
  }

  getDailyStats() {
    const date = new Date().toISOString().split('T')[0];
    return {
      today: ethers.utils.formatEther(this.dailyRewards.get(date) || '0'),
      total: ethers.utils.formatEther(this.totalRewards)
    };
  }
}

module.exports = RewardsTracker;