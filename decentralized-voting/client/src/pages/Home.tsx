/** @format */

import CandidateList from '../components/CandidateList';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">Vote for Your Candidate</h2>
      <CandidateList />
    </motion.section>
  );
};

export default Home;
