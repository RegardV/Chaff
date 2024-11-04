const readline = require('readline');
const fs = require('fs').promises;
const { ethers } = require('ethers');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function validateAddress(address) {
  return ethers.isAddress(address);
}

async function validateNumber(num) {
  return !isNaN(num) && Number(num) > 0;
}

async function setup() {
  console.log('\n🚀 FAssets Liquidator Setup\n');

  try {
    // Check if .env exists
    try {
      await fs.access('.env');
      console.log('⚠️  Warning: .env file already exists. This will overwrite it.\n');
    } catch {}

    // Network selection
    console.log('Available networks:');
    console.log('1. Coston (testnet)');
    console.log('2. Flare (mainnet)');
    const networkChoice = await question('\nSelect network (1-2): ');
    const network = networkChoice === '2' ? 'flare' : 'coston';

    // Registry Address
    let registryAddress;
    do {
      registryAddress = await question('\nEnter FAssets Registry contract address: ');
      if (!await validateAddress(registryAddress)) {
        console.log('❌ Invalid address format. Please try again.');
      }
    } while (!await validateAddress(registryAddress));

    // FAssets Token Address
    let fassetsAddress;
    do {
      fassetsAddress = await question('\nEnter FAssets Token contract address: ');
      if (!await validateAddress(fassetsAddress)) {
        console.log('❌ Invalid address format. Please try again.');
      }
    } while (!await validateAddress(fassetsAddress));

    // Management Wallet
    let managementAddress;
    do {
      managementAddress = await question('\nEnter your Management Wallet address: ');
      if (!await validateAddress(managementAddress)) {
        console.log('❌ Invalid address format. Please try again.');
      }
    } while (!await validateAddress(managementAddress));

    // Liquidation Settings
    console.log('\n📊 Liquidation Strategy Settings:');
    
    // Minimum collateral ratio for liquidation
    let collateralRatioThreshold;
    do {
      collateralRatioThreshold = await question('Enter minimum collateral ratio threshold (e.g., 150 for 150%): ');
      if (!await validateNumber(collateralRatioThreshold)) {
        console.log('❌ Invalid number. Please enter a positive number.');
      }
    } while (!await validateNumber(collateralRatioThreshold));

    // Minimum premium
    let minPremium;
    do {
      minPremium = await question('Enter minimum premium percentage (e.g., 10 for 10%): ');
      if (!await validateNumber(minPremium)) {
        console.log('❌ Invalid number. Please enter a positive number.');
      }
    } while (!await validateNumber(minPremium));

    // Gas price settings
    let maxGasPrice;
    do {
      maxGasPrice = await question('Enter maximum gas price in gwei (e.g., 100): ');
      if (!await validateNumber(maxGasPrice)) {
        console.log('❌ Invalid number. Please enter a positive number.');
      }
    } while (!await validateNumber(maxGasPrice));

    // Liquidation amounts
    const minAmount = await question('\nEnter minimum liquidation amount (default: 1000): ') || '1000';
    const maxAmount = await question('Enter maximum liquidation amount (default: 100000): ') || '100000';

    // Generate environment file
    const envContent = `NETWORK=${network}
REGISTRY_ADDRESS=${registryAddress}
FASSETS_ADDRESS=${fassetsAddress}
MIN_LIQUIDATION_AMOUNT=${minAmount}
MAX_LIQUIDATION_AMOUNT=${maxAmount}
COLLATERAL_RATIO_THRESHOLD=${collateralRatioThreshold}
MIN_PREMIUM=${minPremium}
MAX_GAS_PRICE=${maxGasPrice}`;

    await fs.writeFile('.env', envContent);
    console.log('\n✅ Environment configuration saved to .env');

    // Generate secrets
    console.log('\n🔑 Generating liquidator keys...');
    const wallet = ethers.Wallet.createRandom();
    
    const secrets = {
      native_rpc: network === 'coston' 
        ? "AavSehMLhcgz3crQHH5YJ3Rt8GMQGdV9aViGilADXGnTcjij"
        : "", // Add mainnet RPC if needed
      liquidator: {
        address: wallet.address,
        private_key: wallet.privateKey
      },
      management_address: managementAddress,
      strategy: {
        collateralRatioThreshold: Number(collateralRatioThreshold),
        minPremium: Number(minPremium),
        maxGasPrice: Number(maxGasPrice)
      }
    };

    await fs.writeFile('secrets.json', JSON.stringify(secrets, null, 2));
    console.log('✅ Secrets saved to secrets.json');

    // Set correct permissions
    await fs.chmod('secrets.json', 0o600);
    console.log('✅ File permissions set');

    console.log('\n🎉 Setup complete! Next steps:');
    console.log('1. Fund your liquidator wallet (hot wallet) with some CFLR');
    console.log(`   Address: ${wallet.address}`);
    console.log('2. Start the liquidator:');
    console.log('   npm run dev    # Development mode');
    console.log('   npm start      # Production mode');
    console.log('\n⚠️  Important: Backup your secrets.json file and store it securely!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setup();