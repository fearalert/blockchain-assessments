/** @format */
import { useEffect, useState } from 'react';
import useWeb3 from '../hooks/useWeb3';
import { motion } from 'framer-motion';
import {
  fetchCandidates as getCandidates,
  Candidate,
} from '../services/CandidateService';

const Results = () => {
  const { contract } = useWeb3();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCandidates = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const fetchedCandidates = await getCandidates(contract);
      setCandidates(fetchedCandidates);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      loadCandidates();
      const interval = setInterval(loadCandidates, 10000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  if (!contract) {
    return (
      <p className="text-gray-600">Connect your wallet to view candidates.</p>
    );
  }
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
