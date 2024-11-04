const ethers = require('ethers');
const { FASSET_AGENT_ABI, FASSET_REGISTRY_ABI, FASSETS_TOKEN_ABI } = require('./abis');

class ContractManager {
  constructor(provider, wallet) {
    this.provider = provider;
    this.wallet = wallet;
  }

  getAgentContract(address) {
    return new ethers.Contract(address, FASSET_AGENT_ABI, this.wallet);
  }

  getRegistryContract(address) {
    return new ethers.Contract(address, FASSET_REGISTRY_ABI, this.wallet);
  }

  getFAssetsContract(address) {
    return new ethers.Contract(address, FASSETS_TOKEN_ABI, this.wallet);
  }
}

module.exports = ContractManager;