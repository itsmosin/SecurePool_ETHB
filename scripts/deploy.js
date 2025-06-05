const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Neon EVM...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy MockERC20 token for testing
  console.log("\n📄 Deploying MockERC20 token...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy(
    "SecurePool Test Token",
    "SPTEST",
    1000000 // 1M tokens initial supply
  );
  await mockToken.deployed();
  console.log("✅ MockERC20 deployed to:", mockToken.address);

  // Deploy basic SecurePool Insurance contract
  console.log("\n🛡️  Deploying SecurePoolInsurance...");
  const SecurePoolInsurance = await ethers.getContractFactory("SecurePoolInsurance");
  const insurance = await SecurePoolInsurance.deploy(mockToken.address);
  await insurance.deployed();
  console.log("✅ SecurePoolInsurance deployed to:", insurance.address);

  // Note: For the NeonComposabilityInsurance contract, we would need the actual
  // Neon composability library addresses. For now, we'll deploy it with mock addresses
  console.log("\n🌉 Deploying NeonComposabilityInsurance...");
  
  // These would be the actual Neon EVM composability library addresses
  // For demo purposes, using mock addresses
  const mockSPLTokenProgram = "0x1111111111111111111111111111111111111111";
  const mockSystemProgram = "0x2222222222222222222222222222222222222222";
  
  try {
    const NeonComposabilityInsurance = await ethers.getContractFactory("NeonComposabilityInsurance");
    const neonInsurance = await NeonComposabilityInsurance.deploy(
      mockSPLTokenProgram,
      mockSystemProgram
    );
    await neonInsurance.deployed();
    console.log("✅ NeonComposabilityInsurance deployed to:", neonInsurance.address);
  } catch (error) {
    console.log("⚠️  Note: NeonComposabilityInsurance deployment skipped (requires actual Neon libraries)");
    console.log("Error:", error.message);
  }

  // Setup some initial test data
  console.log("\n🔧 Setting up test data...");
  
  // Mint some tokens to the deployer for testing
  await mockToken.faucet();
  console.log("✅ Minted test tokens to deployer");

  // Approve insurance contract to spend tokens
  await mockToken.approve(insurance.address, ethers.utils.parseEther("100000"));
  console.log("✅ Approved insurance contract to spend tokens");

  // Provide some initial liquidity
  const liquidityAmount = ethers.utils.parseEther("50000");
  await insurance.provideLiquidity(liquidityAmount);
  console.log("✅ Provided initial liquidity:", ethers.utils.formatEther(liquidityAmount), "tokens");

  console.log("\n📋 Deployment Summary:");
  console.log("=================================");
  console.log("Network: Neon EVM Devnet");
  console.log("MockERC20:", mockToken.address);
  console.log("SecurePoolInsurance:", insurance.address);
  console.log("Deployer:", deployer.address);
  
  console.log("\n🎯 Next Steps:");
  console.log("1. Verify contracts on NeonScan:");
  console.log(`   npx hardhat verify ${mockToken.address} "SecurePool Test Token" "SPTEST" 1000000 --network neondevnet`);
  console.log(`   npx hardhat verify ${insurance.address} ${mockToken.address} --network neondevnet`);
  console.log("2. Update frontend with contract addresses");
  console.log("3. Test the DApp functionality");
  
  console.log("\n🔗 Useful Links:");
  console.log("- NeonScan:", "https://devnet.neonscan.org");
  console.log("- Neon Faucet:", "https://neonfaucet.org");
  console.log("- Add Neon Devnet to MetaMask:");
  console.log("  Network Name: Neon EVM DevNet");
  console.log("  RPC URL: https://devnet.neonevm.org");
  console.log("  Chain ID: 245022926");
  console.log("  Currency Symbol: NEON");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 