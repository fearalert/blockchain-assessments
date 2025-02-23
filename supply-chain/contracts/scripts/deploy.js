const hre = require("hardhat");

async function main() {
  const SupplyChainTracker = await hre.ethers.getContractFactory("SupplyChainTracker");
  console.log("Deploying SupplyChainTracker...");
  const supplyChainTracker = await SupplyChainTracker.deploy();

  await supplyChainTracker.deployed();
  console.log("SupplyChainTracker deployed to:", supplyChainTracker.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
