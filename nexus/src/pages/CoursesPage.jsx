import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen } from "react-icons/fa";
import { motion } from 'framer-motion';

const CoursesPage = () => {
    const navigate = useNavigate();
    const courses = [1, 2, 3, 4, 5, 6];

    const handleCourseClick = (courseNumber) => {
        navigate(`/section-chat/${courseNumber}`);
    };

    const renderWelcomeView = () => (
        <motion.div 
            className="flex flex-col items-center justify-center space-y-6 px-4 sm:px-6 lg:px-8 min-h-screen w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className="text-center space-y-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-4xl font-bold text-white">Welcome to Your Courses</h1>
                <p className="text-xl text-nexus-blue-200">Select a course to get started with your learning journey</p>
            </motion.div>

            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 w-full max-w-[1400px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                {courses.map((courseNumber) => (
                    <motion.button 
                        key={courseNumber}
                        onClick={() => handleCourseClick(courseNumber)}
                        className="p-6 h-56 rounded-xl shadow-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition duration-300 flex flex-col justify-between items-center w-full group"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <FaBookOpen className="text-6xl text-white opacity-90 group-hover:scale-110 transition-transform duration-300"/>
                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-bold text-white mb-2">Course {courseNumber}</h2>
                            <p className="text-lg text-nexus-blue-200 group-hover:text-white transition-colors duration-300">Click to join chat</p>
                        </div>
                    </motion.button>
                ))}
            </motion.div>
        </motion.div>
    );

    return (
        <div className="bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 min-h-screen">
            {renderWelcomeView()}
        </div>
    );
};

export default CoursesPage;
