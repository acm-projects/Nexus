import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiAcademicCap, HiCalculator, HiChat, HiUserCircle } from 'react-icons/hi';
import Logo from '../assets/logo.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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

  const linkClasses = `hover:text-nexus-blue-200 flex items-center relative group ${
    isScrolled ? 'text-nexus-blue-900 hover:text-nexus-blue-600' : 'text-white'
  }`;

  const logoTextClasses = `text-xl font-bold ${
    isScrolled ? 'text-nexus-blue-900' : 'text-white'
  }`;

  const loginButtonClasses = `font-bold py-2 px-3 rounded flex items-center ${
    isScrolled
      ? 'bg-nexus-blue-700 text-white hover:bg-nexus-blue-800 transition duration-300 transform hover:scale-110'
      : 'bg-white text-nexus-blue-900 hover:bg-nexus-blue-100 transition duration-300 transform hover:scale-110'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <button 
            className="flex items-center transition duration-300 transform hover:scale-110"
            onClick={() => {
              window.scrollTo(0, 0); // Scroll to top
              navigate('/'); // Navigate to home page
            }}
          >
            <img src={Logo} alt="Nexus Logo" className="h-10 mr-2" />
            <span className={logoTextClasses}>Nexus</span>
          </button>
          <div className="flex space-x-6 items-center">
            <Link to="/courses" className={linkClasses}>
              <HiAcademicCap className="mr-1" /> Courses
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
            </Link>
            <Link to="/grade-calculator" className={linkClasses}>
              <HiCalculator className="mr-1" /> Grade Calculator
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
            </Link>
            <Link to="/chat" className={linkClasses}>
              <HiChat className="mr-1" /> Chat
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
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