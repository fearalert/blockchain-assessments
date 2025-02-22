import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getCandidateData } from "./ContractService";

export interface Candidate {
  name: string;
  voteCount: number;
}

export const fetchCandidates = async (
  contract: ethers.Contract
): Promise<Candidate[]> => {
  const candidateArray: Candidate[] = [];
  try {
    let candidateCountBN;
    try {
      candidateCountBN = await contract.getCandidateCount();
    } catch (error: any) {
      console.error("Error calling getCandidateCount:", error);
      toast.error(
        "Failed to fetch candidate count. Please ensure the contract was deployed with candidate names and you're connected to the correct network."
      );
      return candidateArray;
    }

    const candidateCount = candidateCountBN.toNumber();

    if (candidateCount === 0) {
      toast.info("No candidates available.");
      return candidateArray;
    }

    for (let i = 0; i < candidateCount; i++) {
      try {
        // ContractService helper to get candidate data
        const candidateData = await getCandidateData(contract, i);
        candidateArray.push(candidateData);
      } catch (error) {
        console.error(`Error fetching candidate at index ${i}:`, error);
        toast.error(`Failed to fetch candidate at index ${i}.`);
      }
    }
  } catch (error) {
    console.error("Error fetching candidates:", error);
    toast.error("Failed to fetch candidates. Please try again later.");
  }
  return candidateArray;
};
