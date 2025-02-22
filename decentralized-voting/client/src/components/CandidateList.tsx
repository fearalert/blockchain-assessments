/** @format */
import { useEffect, useState } from 'react';
import CandidateCard from './CandidateCard';
import useWeb3 from '../hooks/useWeb3';
import {
  fetchCandidates as getCandidates,
  Candidate,
} from '../services/CandidateService';

const CandidateList = () => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {loading ? (
        <p>Loading candidates...</p>
      ) : (
        candidates.map((candidate) => (
          <CandidateCard
            key={candidate.name}
            candidate={candidate}
            refreshCandidates={loadCandidates}
          />
        ))
      )}
    </div>
  );
};

export default CandidateList;
