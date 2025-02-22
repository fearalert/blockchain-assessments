/** @format */

import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">About This DApp</h2>
      <p className="text-gray-700">
        This decentralized voting application is built on the Ethereum
        blockchain using Solidity, Hardhat, and a modern React stack. It
        demonstrates secure contract integration, robust error handling,
        logging, toast notifications, and smooth UI animations.
      </p>
    </motion.section>
  );
};

export default About;
