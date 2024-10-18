import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700"></div>
      <div className="relative z-10">
        <motion.h1 
          className="text-5xl font-bold mb-4 text-nexus-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Nexus
        </motion.h1>
        <div className="text-xl mb-8 text-nexus-blue-100 h-16">
          <TypeAnimation
            sequence={[
              '',
              'Connecting students,',
              1000,
              'Connecting students, enhancing collaboration,',
              1000,
              'Connecting students, enhancing collaboration, and boosting academic success.',
            ]}
            wrapper="p"
            speed={80}
            cursor={true}
            repeat={0}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link to="/register" className="bg-white text-nexus-blue-800 hover:bg-nexus-blue-100 font-bold py-3 px-6 rounded-lg inline-flex items-center mx-auto transition duration-300 transform hover:scale-110">
            Get Started <HiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
      <motion.div 
        className="absolute -bottom-16 -left-16 w-64 h-64 bg-nexus-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 0.5, 0.7],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      ></motion.div>
      <motion.div 
        className="absolute -top-16 -right-16 w-64 h-64 bg-nexus-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 0.6, 0.7],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      ></motion.div>
    </section>
  );
};

export default Hero;