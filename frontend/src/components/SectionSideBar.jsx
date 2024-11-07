
/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiAcademicCap, HiChevronLeft, HiChevronRight, HiDocumentText } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const SectionSideBar = ({ courses, selectedCourse, onCourseChange, onToggle }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log("SelectedCourse:",selectedCourse);
  const handleSuperDocClick = () => {
    navigate('/doc-preview', {
      state: {
        fileName: 'SuperDoc.pdf',
        fileUrl: 'path/to/your/superdoc.pdf',
        selectedUnit: 'Unit 1',
        documentName: 'SuperDoc', 
        selectedCourse: selectedCourse
      }
    });
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onToggle(!isCollapsed);
  };

  useEffect(() => {
    onToggle(isCollapsed);
  }, [isCollapsed, onToggle]);

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 },
  };

  return (
    <motion.aside 
      className="bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 shadow-md flex flex-col h-screen fixed left-0 top-0 pt-16 overflow-visible z-40"
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ type: "tween", duration: 0.4 }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-20 -right-6 bg-nexus-blue-600 text-white p-2 rounded-r-md z-50 shadow-md"
      >
        {isCollapsed ? <HiChevronRight size={20} /> : <HiChevronLeft size={20} />}
      </button>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="flex-1 overflow-y-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-nexus-blue-100 mb-4">Courses</h2>
            <ul className="space-y-2">
              {courses.map((course, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button 
                    onClick={() => onCourseChange(course)}
                    className={`flex items-center w-full p-2 rounded hover:bg-nexus-blue-700 text-nexus-blue-200 hover:text-white transition-colors duration-200 ${selectedCourse === course ? 'bg-nexus-blue-700 text-white' : ''}`}
                  >
                    <HiAcademicCap className="mr-2" />
                    {`Course ${course}`}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        className="p-4 mt-auto"
        initial={{ opacity: 1 }}
        animate={{ opacity: isCollapsed ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <button 
          onClick={handleSuperDocClick}
          className="flex items-center justify-center w-full bg-nexus-blue-600 text-white py-2 px-4 rounded-md hover:bg-nexus-blue-500 transition-colors duration-200"
        >
          <HiDocumentText className="mr-2" />
          Super Doc
        </button>
      </motion.div>
    </motion.aside>
  );
};

export default SectionSideBar;
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiAcademicCap, HiChevronLeft, HiChevronRight, HiDocumentText } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const SectionSideBar = ({ selectedCourse, onToggle }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching courses with token:', token);
        const response = await axios.get('http://localhost:3000/api/misc/getOnboardedCourses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        console.log('API Response:', response.data);
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error.response?.data?.message || error.message);
      }
    };

    fetchCourses();
  }, [navigate]);

  const handleSectionChatClick = (course) => {
    // Add validation and logging with the correct property names
    if (!course.courseCode || !course.courseNumber || !course.courseSection) {
      console.error('Missing course information:', course);
      return;
    }

    const roomId = `${course.courseCode}${course.courseNumber}.${course.courseSection}`;
    console.log('Generated roomId:', roomId);
    
    // Validate roomId format
    if (!roomId.match(/[A-Z]+\d+\.\d+/)) {
      console.error('Invalid roomId format:', roomId);
      return;
    }

    navigate(`/section-chat/${roomId}`, {
      state: {
        courseName: `${course.courseCode} ${course.courseNumber}`,
        section: course.courseSection,
        courseId: course.courseId
      }
    });
  };

  const handleSuperDocClick = () => {
    navigate('/doc-preview', {
      state: {
        fileName: 'SuperDoc.pdf',
        fileUrl: 'path/to/your/superdoc.pdf',
        selectedUnit: 'unit1',
        documentName: 'SuperDoc'
      }
    });
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    onToggle(!isCollapsed);
  };

  useEffect(() => {
    onToggle(isCollapsed);
  }, [isCollapsed, onToggle]);

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 },
  };

  return (
    <motion.aside 
      className="bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 shadow-md flex flex-col h-screen fixed left-0 top-0 pt-16 overflow-visible z-40"
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ type: "tween", duration: 0.4 }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-20 -right-6 bg-nexus-blue-600 text-white p-2 rounded-r-md z-50 shadow-md"
      >
        {isCollapsed ? <HiChevronRight size={20} /> : <HiChevronLeft size={20} />}
      </button>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="flex-1 overflow-y-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-nexus-blue-100 mb-4">Your Courses</h2>
            <ul className="space-y-2">
              {courses.map((course, index) => (
                <motion.li 
                  key={course.courseId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button 
                    onClick={() => handleSectionChatClick(course)}
                    className={`flex items-center w-full p-2 rounded hover:bg-nexus-blue-700 text-nexus-blue-200 hover:text-white transition-colors duration-200 ${
                      selectedCourse === `${course.courseCode}${course.courseNumber}` ? 'bg-nexus-blue-700 text-white' : ''
                    }`}
                  >
                    <HiAcademicCap className="mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{`${course.courseCode} ${course.courseNumber}`}</div>
                      <div className="text-sm opacity-75">Section {course.courseSection}</div>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        className="p-4 mt-auto"
        initial={{ opacity: 1 }}
        animate={{ opacity: isCollapsed ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <button 
          onClick={handleSuperDocClick}
          className="flex items-center justify-center w-full bg-nexus-blue-600 text-white py-2 px-4 rounded-md hover:bg-nexus-blue-500 transition-colors duration-200"
        >
          <HiDocumentText className="mr-2" />
          Super Doc
        </button>
      </motion.div>
    </motion.aside>
  );
};

export default SectionSideBar;