/** @format */

import React, { useEffect, useState } from 'react';
import CandidateCard from './CandidateCard';
import useWeb3 from '../hooks/useWeb3';
import { ethers } from 'ethers';

interface Candidate {
  name: string;
  voteCount: number;
}

const CandidateList: React.FC = () => {
  const { contract } = useWeb3();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCandidates = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      // Get the candidate count from the contract
      const candidateCountBN = await contract.getCandidateCount();
      const candidateCount = candidateCountBN.toNumber();
      const candidateArray: Candidate[] = [];

      for (let i = 0; i < candidateCount; i++) {
        const candidateBytes = await contract.candidateList(i);
        const candidateName = ethers.encodeBytes32String(candidateBytes);
        const voteCountBN = await contract.totalVotesFor(candidateBytes);
        candidateArray.push({
          name: candidateName,
          voteCount: voteCountBN.toNumber(),
        });
      }
      setCandidates(candidateArray);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchCandidates();
      // Optionally poll for updates (e.g., every 10 seconds)
      const interval = setInterval(fetchCandidates, 10000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  if (!contract) {
    return (
      <p className="text-gray-600">
        Please connect your wallet to view candidates.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        candidates.map((candidate) => (
          <CandidateCard
            key={candidate.name}
            candidate={candidate}
            refreshCandidates={fetchCandidates}
          />
        ))
      )}
    </div>
  );
};

export default CandidateList;
