import React from 'react';
import { BsArrowLeftShort } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookOpen } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { motion } from 'framer-motion';
import axios from 'axios';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            const token = localStorage.getItem('token');
            
            // Debug token
            console.log('Current token:', token);
            
            if (!token) {
                console.error('No token found in localStorage');
                navigate('/login'); // Redirect to login if no token
                return;
            }

            // Verify token format
            try {
                const tokenParts = token.split('.');
                if (tokenParts.length !== 3) {
                    console.error('Token is not in valid JWT format');
                    localStorage.removeItem('token'); // Clear invalid token
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/misc/getOnboardedCourses', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                console.log('API Response:', response.data);

                console.log('Fetched courses:', response.data.courses);
                setCourses(response.data.courses);
                setError(null);

            } catch (error) {
                console.error('Full error object:', error);
                
                if (error.response) {
                    console.error('Error response:', {
                        status: error.response.status,
                        data: error.response.data
                    });

                    if (error.response.status === 401) {
                        console.error('Token verification failed');
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                }
                
                setError(error.response?.data?.message || 'Failed to fetch courses');
            }
        };

        fetchCourses();
    }, [navigate]);

    const handleSectionChatClick = (course) => {
        // Add validation and logging with the correct property names
        if (!course.courseCode || !course.courseNumber || !course.courseSection) {  // Changed from course.section to course.courseSection
            console.error('Missing course information:', course);
            return;
        }
    
        const roomId = `${course.courseCode}${course.courseNumber}.${course.courseSection}`; // Changed from course.section to course.courseSection
        console.log('Generated roomId:', roomId);
        
        // Validate roomId format
        if (!roomId.match(/[A-Z]+\d+\.\d+/)) {
            console.error('Invalid roomId format:', roomId);
            return;
        }
    
        navigate(`/section-chat/${roomId}`, {
            state: {
                courseName: `${course.courseCode} ${course.courseNumber}`,
                section: course.courseSection,  // Changed from course.section to course.courseSection
                courseId: course.courseId  // Changed from course._id to course.courseId
            }
        });
    };

    // Show error state if there's an error
    if (error) {
        return (
            <div className="bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 min-h-screen flex items-center justify-center">
                <div className="text-white text-center p-8 rounded-lg">
                    <h2 className="text-2xl mb-4">Error Loading Courses</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
                {courses.map((course, index) => (
                    <motion.button 
                        key={course.courseId}
                        onClick={() => handleSectionChatClick(course)}
                        className="p-6 h-56 rounded-xl shadow-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition duration-300 flex flex-col justify-between items-center w-full group"
                        whileHover={{ y: -5, transition: { duration: 0.01 } }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <FaBookOpen className="text-6xl text-white opacity-90 group-hover:scale-110 transition-transform duration-300"/>
                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-bold text-white mb-2">{`${course.courseCode} ${course.courseNumber}`}</h2>
                            <p className="text-lg text-nexus-blue-200 group-hover:text-white transition-colors duration-300 group-hover:underline group-hover:decoration-white">Click to join chat</p>
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