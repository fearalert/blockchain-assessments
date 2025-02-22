/** @format */
import { useState } from 'react';
import useWeb3 from '../hooks/useWeb3';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface Candidate {
  name: string;
  voteCount: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  refreshCandidates: () => void;
}

const CandidateCard = ({
  candidate,
  refreshCandidates,
}: CandidateCardProps) => {
  const { contract } = useWeb3();
  const [voting, setVoting] = useState(false);

  const handleVote = async () => {
    if (!contract) return;
    try {
      setVoting(true);
      // Convert the candidate name (string) to bytes32 using ethers.utils.formatBytes32String
      const candidateBytes = ethers.encodeBytes32String(candidate.name);
      const tx = await contract.voteForCandidate(candidateBytes);
      await tx.wait();
      toast.success(`Vote cast for ${candidate.name}!`);
      refreshCandidates();
    } catch (err: any) {
      console.error('Vote error:', err);
      toast.error('Voting failed. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  return (
    <motion.div
      className="bg-white shadow rounded p-4 flex flex-col"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}>
      <h3 className="text-lg font-semibold">{candidate.name}</h3>
      <p className="text-gray-600 mb-2">Votes: {candidate.voteCount}</p>
      <button
        onClick={handleVote}
        disabled={voting}
        className="mt-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
        {voting ? 'Voting...' : 'Vote'}
      </button>
    </motion.div>
  );
};

export default CandidateCard;
