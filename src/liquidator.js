const ethers = require('ethers');
const cron = require('node-cron');
const logger = require('./utils/logger');
const { loadSecrets } = require('./utils/secrets');
const ContractManager = require('./contracts/contracts');
const RewardsTracker = require('./rewards/tracker');
const { sleep } = require('./utils/helpers');

class Liquidator {
  constructor(provider, wallet, secrets, config) {
    this.provider = provider;
    this.wallet = wallet;
    this.secrets = secrets;
    this.config = config;
    this.contractManager = new ContractManager(provider, wallet);
    this.registry = this.contractManager.getRegistryContract(config.registryAddress);
    this.rewardsTracker = new RewardsTracker();
  }

  async checkLiquidationOpportunities() {
    try {
      // Get your current FAssets balance
      const fassetsBalance = await this.getFAssetsBalance();
      if (fassetsBalance.isZero()) {
        logger.warn('No FAssets available for liquidation. Please mint some FAssets first.');
        return;
      }

      const agents = await this.registry.getActiveAgents();
      logger.info(`Checking ${agents.length} active agents for profitable liquidation opportunities`);

      for (const agentAddress of agents) {
        await this.checkAgent(agentAddress);
        await sleep(1000); // Prevent rate limiting
      }

      // Log daily stats
      const stats = this.rewardsTracker.getDailyStats();
      logger.info(`Daily Summary - Today's Rewards: ${stats.today} CFLR, Total Rewards: ${stats.total} CFLR`);
    } catch (error) {
      logger.error('Error checking liquidation opportunities:', error);
    }
  }

  async checkAgent(agentAddress) {
    try {
      const agent = this.contractManager.getAgentContract(agentAddress);
      const [collateralRatio, settings] = await Promise.all([
        agent.getCollateralRatio(),
        agent.getLiquidationSettings()
      ]);

      // Check if liquidation is profitable
      const premium = settings.premium;
      const isLiquidatable = collateralRatio.lt(settings.threshold);
      const isProfitable = premium.gte(ethers.utils.parseUnits('10', 'gwei')); // Minimum 10 gwei premium

      if (isLiquidatable && isProfitable) {
        logger.info(`Found profitable liquidation for agent ${agentAddress} with ${premium}% premium`);
        await this.executeLiquidation(agentAddress, premium);
      }
    } catch (error) {
      logger.error(`Error checking agent ${agentAddress}:`, error);
    }
  }

  async executeLiquidation(agentAddress, premium) {
    try {
      const agent = this.contractManager.getAgentContract(agentAddress);
      const status = await agent.getAgentStatus();

      if (status !== 1) { // 1 = active status
        logger.info(`Agent ${agentAddress} is not in active status, skipping liquidation`);
        return;
      }

      const collateral = await this.registry.getAgentCollateral(agentAddress);
      const liquidationAmount = this.calculateLiquidationAmount(collateral);

      logger.info(`Executing liquidation for agent ${agentAddress}:`);
      logger.info(`- Amount: ${ethers.utils.formatEther(liquidationAmount)} FAssets`);
      logger.info(`- Premium: ${premium}%`);
      
      const tx = await agent.liquidate(liquidationAmount, {
        gasLimit: 500000,
        maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei')
      });

      const receipt = await tx.wait();
      
      // Track rewards
      await this.rewardsTracker.trackLiquidationReward(agentAddress, liquidationAmount, premium);

      logger.info(`✅ Liquidation successful! Transaction: ${tx.hash}`);
      logger.info(`💰 Earned ${premium}% premium on ${ethers.utils.formatEther(liquidationAmount)} FAssets`);
    } catch (error) {
      logger.error(`Error executing liquidation for agent ${agentAddress}:`, error);
    }
  }

  async getFAssetsBalance() {
    // This would be implemented based on your FAssets token contract
    const fassetsContract = this.contractManager.getFAssetsContract(this.config.fassetsAddress);
    return await fassetsContract.balanceOf(this.wallet.address);
  }

  calculateLiquidationAmount(collateral) {
    const maxAmount = ethers.utils.parseEther(this.config.maxLiquidationAmount.toString());
    const minAmount = ethers.utils.parseEther(this.config.minLiquidationAmount.toString());
    
    // Calculate 10% of collateral as default liquidation amount
    const defaultAmount = collateral.mul(10).div(100);

    if (defaultAmount.gt(maxAmount)) return maxAmount;
    if (defaultAmount.lt(minAmount)) return minAmount;
    return defaultAmount;
  }
}

async function setupLiquidator() {
  const secrets = await loadSecrets();
  const config = {
    registryAddress: process.env.REGISTRY_ADDRESS,
    fassetsAddress: process.env.FASSETS_ADDRESS,
    minLiquidationAmount: process.env.MIN_LIQUIDATION_AMOUNT || 1000,
    maxLiquidationAmount: process.env.MAX_LIQUIDATION_AMOUNT || 100000
  };

  const provider = new ethers.providers.JsonRpcProvider(secrets.native_rpc);
  const wallet = new ethers.Wallet(secrets.liquidator.private_key, provider);
  
  const liquidator = new Liquidator(provider, wallet, secrets, config);

  // Schedule liquidation checks every minute
  cron.schedule('* * * * *', () => {
    liquidator.checkLiquidationOpportunities();
  });

  return liquidator;
}

module.exports = {
  setupLiquidator
};