const FASSET_AGENT_ABI = [
  "function getCollateralRatio() view returns (uint256)",
  "function getLiquidationSettings() view returns (uint256 threshold, uint256 premium)",
  "function liquidate(uint256 amount) external",
  "function getAgentStatus() view returns (uint8 status)"
];

const FASSET_REGISTRY_ABI = [
  "function getActiveAgents() view returns (address[])",
  "function getAgentCollateral(address agent) view returns (uint256)"
];

const FASSETS_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

module.exports = {
  FASSET_AGENT_ABI,
  FASSET_REGISTRY_ABI,
  FASSETS_TOKEN_ABI
};