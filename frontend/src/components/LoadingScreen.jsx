import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg text-center"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-nexus-blue-600 border-t-transparent rounded-full" role="status">
          </div>
          <h2 className="text-xl font-semibold text-nexus-blue-800">{message}</h2>
          <p className="text-nexus-blue-600">Please wait while we fetch your courses from Blackboard...</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;