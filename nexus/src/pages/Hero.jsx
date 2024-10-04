import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const Hero = () => {
  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-4 text-nexus-white">Welcome to Nexus</h1>
      <p className="text-xl mb-8 text-nexus-blue-100">Connecting students, enhancing collaboration, and boosting academic success.</p>
      <Link to="/register" className="bg-white text-nexus-blue-800 hover:bg-nexus-blue-100 font-bold py-3 px-6 rounded-lg inline-flex items-center mx-auto transition duration-300">
        Get Started <HiArrowRight className="ml-2" />
      </Link>
    </section>
  );
};

export default Hero;