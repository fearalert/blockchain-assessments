/** @format */
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import useWeb3 from '../hooks/useWeb3';
import { toast } from 'react-toastify';
import CandidateCard from './CandidateCard';

interface Candidate {
  name: string;
  voteCount: number;
}

const CandidateList = () => {
  const { contract } = useWeb3();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCandidates = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      // Use ethers.js to call the contract function getCandidateCount
      const candidateCountBN = await contract.getCandidateCount();
      const candidateCount = candidateCountBN.toNumber();
      const candidateArray: Candidate[] = [];
      for (let i = 0; i < candidateCount; i++) {
        // Get candidate bytes from the candidateList mapping
        const candidateBytes = await contract.candidateList(i);
        // Convert bytes32 to string
        const candidateName = ethers.decodeBytes32String(candidateBytes);
        const voteCountBN = await contract.totalVotesFor(candidateBytes);
        candidateArray.push({
          name: candidateName,
          voteCount: voteCountBN.toNumber(),
        });
      }
      setCandidates(candidateArray);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to fetch candidates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchCandidates();
      const interval = setInterval(fetchCandidates, 10000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  if (!contract) {
    return (
      <p className="text-gray-600">Connect your wallet to view candidates.</p>
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
