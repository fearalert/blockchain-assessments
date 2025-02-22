// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Define candidate names – note we convert strings to bytes32
  const candidates = [
    ethers.utils.formatBytes32String("Alice"),
    ethers.utils.formatBytes32String("Bob"),
    ethers.utils.formatBytes32String("Charlie")
  ];

  // Get the contract factory and deploy
  const Voting = await ethers.getContractFactory("Voting");
  const votingContract = await Voting.deploy(candidates);

  await votingContract.deployed();
  console.log("Voting Contract deployed to:", votingContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });