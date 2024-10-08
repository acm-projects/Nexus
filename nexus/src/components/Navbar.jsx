import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiCalculator, HiChat, HiUserCircle } from 'react-icons/hi';
import Logo from '../assets/logo.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white bg-opacity-90 shadow-md' : 'bg-transparent'
  }`;

  const linkClasses = `hover:text-nexus-blue-200 flex items-center ${
    isScrolled ? 'text-nexus-blue-900 hover:text-nexus-blue-600' : 'text-white'
  }`;

  const logoTextClasses = `text-xl font-bold ${
    isScrolled ? 'text-nexus-blue-900' : 'text-white'
  }`;

  const loginButtonClasses = `font-bold py-2 px-3 rounded flex items-center ${
    isScrolled
      ? 'bg-nexus-blue-700 text-white hover:bg-nexus-blue-800'
      : 'bg-white text-nexus-blue-900 hover:bg-nexus-blue-100'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Nexus Logo" className="h-10 mr-2" />
            <span className={logoTextClasses}>Nexus</span>
          </Link>
          <div className="flex space-x-6 items-center">
            <Link to="/courses" className={linkClasses}>
              <HiAcademicCap className="mr-1" /> Courses
            </Link>
            <Link to="/grade-calculator" className={linkClasses}>
              <HiCalculator className="mr-1" /> Grade Calculator
            </Link>
            <Link to="/chat" className={linkClasses}>
              <HiChat className="mr-1" /> Chat
            </Link>
            <Link to="/login" className={loginButtonClasses}>
              <HiUserCircle className="mr-1" /> Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;