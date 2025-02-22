/** @format */

import { useEffect, useState } from 'react';
import useWeb3 from '../hooks/useWeb3';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface Candidate {
  name: string;
  voteCount: number;
}

const Results = () => {
  const { contract } = useWeb3();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchResults = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const candidateCountBN = await contract.getCandidateCount();
      const candidateCount = candidateCountBN.toNumber();
      const results: Candidate[] = [];
      for (let i = 0; i < candidateCount; i++) {
        const candidateBytes = await contract.candidateList(i);
        const name = ethers.decodeBytes32String(candidateBytes);
        const votesBN = await contract.totalVotesFor(candidateBytes);
        results.push({ name, voteCount: votesBN.toNumber() });
      }
      setCandidates(results);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error(`Error fetching results`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchResults();
      const interval = setInterval(fetchResults, 10000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  return (
    <motion.section
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">Voting Results</h2>
      {loading ? (
        <p>Loading results...</p>
      ) : (
        <div className="space-y-4">
          {candidates.map((cand) => (
            <div
              key={cand.name}
              className="bg-white shadow rounded p-4 flex justify-between items-center">
              <span className="font-semibold">{cand.name}</span>
              <span>{cand.voteCount} Votes</span>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default Results;
