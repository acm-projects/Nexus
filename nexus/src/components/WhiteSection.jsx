import React from 'react';
import { HiLightBulb, HiUserGroup, HiDocumentText, HiCalculator } from 'react-icons/hi';
import { motion } from 'framer-motion';

const WhiteSection = () => {
  const features = [
    { icon: HiCalculator, title: 'Smart Learning', description: 'See impact of a quiz or exam onto your grade ' },
    { icon: HiUserGroup, title: 'Collaborative Environment', description: 'Connect with peers and share knowledge effortlessly' },
    { icon: HiDocumentText, title: 'Resource Sharing', description: 'Access and contribute to study materials' },
  ];

  return (
    <section className="bg-gradient-to-b from-nexus-blue-100 via-white to-nexus-blue-100 py-16">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 text-nexus-blue-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          A Free Hub For All Students
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <feature.icon className="text-5xl text-nexus-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-nexus-blue-800">{feature.title}</h3>
              <p className="text-nexus-blue-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhiteSection;