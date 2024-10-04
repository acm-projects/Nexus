import React from 'react';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiCalculator, HiChat, HiUserCircle, HiCube } from 'react-icons/hi';

const Navbar = () => {
  return (
    <nav className="bg-nexus-blue-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <HiCube className="text-white text-3xl mr-2" />
            <span className="text-white text-xl font-bold">Nexus</span>
          </Link>
          <div className="flex space-x-6 items-center">
            <Link to="/courses" className="text-white hover:text-nexus-blue-200 flex items-center">
              <HiAcademicCap className="mr-1" /> Courses
            </Link>
            <Link to="/grade-calculator" className="text-white hover:text-nexus-blue-200 flex items-center">
              <HiCalculator className="mr-1" /> Grade Calculator
            </Link>
            <Link to="/chat" className="text-white hover:text-nexus-blue-200 flex items-center">
              <HiChat className="mr-1" /> Chat
            </Link>
            <Link to="/login" className="bg-white text-nexus-blue-800 hover:bg-nexus-blue-100 font-bold py-2 px-3 rounded flex items-center">
              <HiUserCircle className="mr-1" /> Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;