import React from 'react';
import { BsArrowLeftShort } from "react-icons/bs";
import { useState, useEffect } from 'react'; //use to make sidebar collapsible
import { Link, useNavigate } from 'react-router-dom';
import { FaBookOpen } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { motion } from 'framer-motion';
import axios from 'axios';

const CoursesPage = () =>{

    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user courses using Axios
        const fetchCourses = async () => {
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:3000/api/misc/getOnboardedCourses', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCourses(response.data.courses);  // Set the courses in state
                console.log('Fetched courses:', response.data.courses);

            } catch (error) {
                console.error('Error fetching courses:', error.response?.data?.message || error.message);
            }
        };

        fetchCourses();
    }, []);

    const handleSectionChatClick = (course) => {
        const roomId = `${course.courseCode}${course.courseNumber}.${course.section}`;
        navigate(`/section-chat/${roomId}`, {
            state: {
                courseName: `${course.courseCode} ${course.courseNumber}`,
                section: course.section,
                courseId: course._id
            }
        });
    };

    return(
        <div>
            <div className = "bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 h-screen w-screen">
                <div className = "flex justify-center">
                    <motion.h1
                        className = "pt-20 text-white text-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                    Navigate to a Course to Access Chatrooms
                    </motion.h1>
                </div>
                
                <motion.div 
                    className = "mx-6 my-6 grid grid-cols-3 gap-x-4 gap-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                {courses.map((course, index) => (
                    <div // Changed from button to div 
                        key={index} 
                        className="pt-6 h-64 rounded-md bg-transparent border-2 border-nexus-blue-200 no-underline transition duration-300 hover:border-nexus-blue-400 hover:transform hover:-translate-y-1 flex flex-col justify-start items-center"
                    >
                        <FaBookOpen className="text-9xl flex justify-center items-start bg-transparent text-nexus-blue-200 text-opacity-60"/>
                        <div className="mt-auto w-full py-4 bg-nexus-blue-200 text-nexus-blue-900 flex flex-col justify-end items-center">
                            <h1 className="text-xl font-bold">{`${course.courseCode} ${course.courseNumber}`}</h1>
                            <button 
                                onClick={() => handleSectionChatClick(course)}
                                className="text-sm transition duration-300 hover:underline hover:text-nexus-blue-400"
                            >
                                Section Chat
                            </button>
                        </div>
                    </div>
                ))}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    transition={{ duration: 0.8, delay: 1.3 }}
                >
                    <Link to="/upload" className="px-3 py-3 rounded-lg bg-nexus-blue-200 text-white fixed bottom-6 right-6 transition duration-300 hover:text-white transform hover:bg-nexus-blue-300">
                        Upload Doc
                    </Link>
                    {/* temporary SuperDoc link location */}
                    <h1 className = "px-4 py-3 rounded-lg bg-nexus-blue-200 text-white fixed bottom-6 right-36 transition duration-300 hover:text-white transform hover:bg-nexus-blue-300">SuperDoc</h1>
                </motion.div>

            </div>
        </div>
    );
};

export default CoursesPage;