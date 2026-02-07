const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Deploying PropertyToken...");
  console.log("Deployer:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

  const PropertyToken = await hre.ethers.getContractFactory("PropertyToken");

  const propertyToken = await PropertyToken.deploy({
    gasLimit: 6_000_000, // REQUIRED for OZ v5 + ERC1155
    maxFeePerGas: hre.ethers.parseUnits("3", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("2", "gwei"),
  });

  console.log("⏳ Transaction sent. Waiting for confirmation...");

  await propertyToken.waitForDeployment();

  console.log("✅ PropertyToken deployed at:", propertyToken.target);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
// 0xAf33E31C3D2E117384De2e255d3F14Fb14705ED7
// 0xd9894C00731ac7c13F729B831Fcf2b327b8FfBb4 
// Only Owner Wala Bug in settlement 