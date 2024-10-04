import React from 'react';
import { HiUserGroup, HiDocumentText, HiUsers, HiAcademicCap } from 'react-icons/hi';

const features = [
  {
    title: 'Automatic Course Groups',
    description: 'Every course has a dedicated group for easy collaboration.',
    icon: HiUserGroup,
  },
  {
    title: 'Advanced Collaboration Tools',
    description: 'Access forums, document sharing, and note consolidation features.',
    icon: HiDocumentText,
  },
  {
    title: 'Inclusive Platform',
    description: 'Ensure all students can easily join and benefit from course-specific groups.',
    icon: HiUsers,
  },
  {
    title: 'Enhanced Learning Experience',
    description: 'Communicate, plan ahead, and share study notes effortlessly.',
    icon: HiAcademicCap,
  },
];

const Features = () => {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-center mb-12 text-nexus-white">Why Choose Nexus?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg flex items-start backdrop-filter backdrop-blur-lg">
            <feature.icon className="text-4xl text-nexus-blue-300 mr-4 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-nexus-white">{feature.title}</h3>
              <p className="text-nexus-blue-100">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;