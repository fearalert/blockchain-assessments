import { ethers } from "ethers";
import VotingAbi from "../contracts/voting.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const getContractInstance = (signer: ethers.Signer): ethers.Contract => {
  return new ethers.Contract(CONTRACT_ADDRESS, VotingAbi.abi, signer);
};

export const voteForCandidate = async (contract: ethers.Contract, candidateName: string): Promise<void> => {
  const candidateBytes = ethers.encodeBytes32String(candidateName);
  const tx = await contract.voteForCandidate(candidateBytes);
  await tx.wait();
};

export const getCandidateData = async (contract: ethers.Contract, index: number): Promise<{ name: string; voteCount: number }> => {
  const candidateBytes = await contract.candidateList(index);
  const name = ethers.decodeBytes32String(candidateBytes);
  const voteCountBN = await contract.totalVotesFor(candidateBytes);
  return { name, voteCount: voteCountBN.toNumber() };
};
