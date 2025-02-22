const hre = require("hardhat");

async function main() {
  // Get the deployer's signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Log the deployer's balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance));

  // Get and log the network's chain id
  const network = await hre.ethers.provider.getNetwork();
  console.log("Network chain id:", network.chainId);

  // Convert candidate names to bytes32 using ethers v5 syntax
  const candidates = [
    hre.ethers.utils.formatBytes32String("Alice"),
    hre.ethers.utils.formatBytes32String("Bob"),
    hre.ethers.utils.formatBytes32String("Charlie")
  ];

  // Get the contract factory
  const Voting = await hre.ethers.getContractFactory("Voting");
  console.log("Deploying Voting contract...");
  
  // Deploy with constructor arguments
  const votingContract = await Voting.deploy(candidates);
  
  // Wait for deployment
  await votingContract.deployed();
  
  console.log("Voting Contract deployed to:", votingContract.address);
  
  // Verify the deployment
  const candidateCount = await votingContract.getCandidateCount();
  console.log("Number of candidates:", candidateCount.toString());
  
  // Log the first candidate
  const firstCandidate = await votingContract.candidateList(0);
  console.log("First candidate (bytes32):", firstCandidate);
  console.log("First candidate (decoded):", hre.ethers.utils.parseBytes32String(firstCandidate));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
