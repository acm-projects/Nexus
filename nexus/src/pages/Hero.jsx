import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { TypeAnimation } from 'react-type-animation';

const Hero = () => {
  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-4 text-nexus-white">Welcome to Nexus</h1>
      <div className="text-xl mb-8 text-nexus-blue-100 h-16">
        <TypeAnimation
          sequence={[
            'Connecting students,',
            1000,
            'Connecting students, enhancing collaboration,',
            1000,
            'Connecting students, enhancing collaboration, and boosting academic success.',
          ]}
          wrapper="p"
          speed={50}
          cursor={true}
          repeat={0}
        />
      </div>
      <Link to="/register" className="bg-white text-nexus-blue-800 hover:bg-nexus-blue-100 font-bold py-3 px-6 rounded-lg inline-flex items-center mx-auto transition duration-300">
        Get Started <HiArrowRight className="ml-2" />
      </Link>
    </section>
  );
};

export default Hero;