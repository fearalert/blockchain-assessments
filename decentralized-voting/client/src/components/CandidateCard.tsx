/** @format */

import React, { useState } from 'react';
import useWeb3 from '../hooks/useWeb3';
import { ethers } from 'ethers';

interface Candidate {
  name: string;
  voteCount: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  refreshCandidates: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  refreshCandidates,
}) => {
  const { contract } = useWeb3();
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  const handleVote = async () => {
    if (!contract) return;
    try {
      setVoting(true);
      setError('');
      // Convert candidate name to bytes32 format for the contract call
      const candidateBytes = ethers.encodeBytes32String(candidate.name);
      const tx = await contract.voteForCandidate(candidateBytes);
      await tx.wait();
      refreshCandidates();
    } catch (err: any) {
      console.error(err);
      setError('Voting failed. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 flex flex-col">
      <h3 className="text-lg font-semibold">{candidate.name}</h3>
      <p className="text-gray-600 mb-2">Votes: {candidate.voteCount}</p>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={handleVote}
        disabled={voting}
        className="mt-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
        {voting ? 'Voting...' : 'Vote'}
      </button>
    </div>
  );
};

export default CandidateCard;
