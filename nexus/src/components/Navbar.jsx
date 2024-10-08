import React from 'react';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiCalculator, HiChat, HiUserCircle } from 'react-icons/hi';
import Logo from '../assets/logo.svg';

const Navbar = () => {
  return (
    <nav className="bg-nexus-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Nexus Logo" className="h-10 mr-2" />
            <span className="text-nexus-blue-900 text-xl font-bold">Nexus</span>
          </Link>
          <div className="flex space-x-6 items-center">
            <Link to="/courses" className="text-nexus-blue-900 hover:text-nexus-blue-700 flex items-center">
              <HiAcademicCap className="mr-1" /> Courses
            </Link>
            <Link to="/grade-calculator" className="text-nexus-blue-900 hover:text-nexus-blue-700 flex items-center">
              <HiCalculator className="mr-1" /> Grade Calculator
            </Link>
            <Link to="/chat" className="text-nexus-blue-900 hover:text-nexus-blue-700 flex items-center">
              <HiChat className="mr-1" /> Chat
            </Link>
            <Link to="/login" className="bg-nexus-blue-700 text-nexus-white hover:bg-nexus-blue-800 font-bold py-2 px-3 rounded flex items-center">
              <HiUserCircle className="mr-1" /> Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;