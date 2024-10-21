import React from 'react';
import { BsArrowLeftShort } from "react-icons/bs";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookOpen } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { motion } from 'framer-motion';

const CoursesPage = () => {
    const navigate = useNavigate();

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

    return(
        <div>
            <div className="bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 h-screen w-screen">
                <div className="flex justify-center">
                    <motion.h1
                        className="pt-20 text-white text-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                    Navigate to a Course to Access Chatrooms
                    </motion.h1>
                </div>
                
                <motion.div 
                    className="mx-6 my-6 grid grid-cols-3 gap-x-4 gap-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {/* Course buttons */}
                    {[1, 2, 3, 4, 5, 6].map((courseNumber) => (
                        <button key={courseNumber} className="pt-6 h-64 rounded-md bg-transparent border-2 border-nexus-blue-200 no-underline transition duration-300 hover:border-nexus-blue-400 hover:transform hover:-translate-y-1 flex flex-col justify-start items-center">
                            {courseNumber % 2 === 0 ? (
                                <IoBookOutline className="text-9xl flex justify-center items-start bg-transparent text-nexus-blue-200 text-opacity-60"/>
                            ) : (
                                <FaBookOpen className="text-9xl flex justify-center items-start bg-transparent text-nexus-blue-200 text-opacity-60"/>
                            )}
                            <div className="mt-auto w-full py-4 bg-nexus-blue-200 text-nexus-blue-900 flex flex-col justify-end items-center">
                                <h1 className="text-xl font-bold">Course {courseNumber}</h1>
                                <Link to="/section-chat" className="text-sm transition duration 300 hover:underline hover:text-nexus-blue-400">Section Chat</Link>
                            </div>
                        </button>
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
                    <button 
                        onClick={handleSuperDocClick}
                        className="px-4 py-3 rounded-lg bg-nexus-blue-200 text-white fixed bottom-6 right-36 transition duration-300 hover:text-white transform hover:bg-nexus-blue-300"
                    >
                        Super Doc
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default CoursesPage;