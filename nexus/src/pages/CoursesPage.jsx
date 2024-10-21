import React from 'react';
import { BsArrowLeftShort } from "react-icons/bs";
import { useState } from 'react'; //use to make sidebar collapsible
import { Link } from 'react-router-dom';
import { FaBookOpen } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { motion } from 'framer-motion';

const CoursesPage = () =>{
    return(
        <div>
            {/* <div className = "bg-gradient-to-b from-nexus-blue-200 via-white to-nexus-blue-200 h-screen p-5 w-100 relative flex flex-col justify-start items-center sidebar">
                <BsArrowLeftShort className = "bg-white text-nexus-blue-900 text-3xl rounded-full absolute -right-3 top-20 border border-nexus-blue-900 cursor-pointer"/>
                <h1 className = "pt-20 pb-5 text-2xl sidebar-title">My Courses</h1>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 1</button>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 2</button>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 3</button>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 4</button>
                    <button className = "p-6 rounded-lg text-nexus-blue-900 hover:bg-nexus-blue-900 transition duration-300 hover:text-white transform hover:scale-110">Course 5</button>
                    <Link to = "/section-chat" className = "transition duration 300 hover:text-nexus-blue-900">Section Chat</Link>
                    <div className = "mt-auto">
                        <Link to = "/upload" className = "p-2 pb-3 pt-3 rounded-lg bg-nexus-blue-200 text-white transition duration 300 hover:text-white transform hover:bg-nexus-blue-300">Upload Doc</Link> 
                    </div>
            </div> */}
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
                    <button className = "pt-6 h-64 rounded-md bg-transparent border-2 border-nexus-blue-200 no-underline transition duration-300 hover:border-nexus-blue-400 hover:transform hover:-translate-y-1 flex flex-col justify-start items-center">
                        <FaBookOpen className = "text-9xl flex justify-center items-start bg-transparent text-nexus-blue-200 text-opacity-60"/>
                        <div className = "mt-auto w-full py-4 bg-nexus-blue-200 text-nexus-blue-900 flex flex-col justify-end items-center">
                        <h1 className = "text-xl font-bold">Course 1</h1>
                        <Link to = "/section-chat" className = "text-sm transition duration 300 hover:underline hover:text-nexus-blue-400">Section Chat</Link>
                        </div>
                    </button>
                    <button className = "pt-6 h-64 rounded-md bg-transparent border-2 border-nexus-blue-200 no-underline transition duration-300 hover:border-nexus-blue-400 hover:transform hover:-translate-y-1 flex flex-col justify-start items-center">
                        <IoBookOutline className = "text-9xl flex justify-center items-start bg-transparent text-nexus-blue-200 text-opacity-60"/>
                        <div className = "mt-auto w-full py-4 bg-nexus-blue-200 text-nexus-blue-900 flex flex-col justify-end items-center">
                        <h1 className = "text-xl font-bold">Course 2</h1>
                        <Link to = "/section-chat" className = "text-sm transition duration 300 hover:underline hover:text-nexus-blue-400">Section Chat</Link>
                        </div>
                    </button>
                    <button className = "pt-6 h-64 rounded-md bg-transparent border-2 border-nexus-blue-200 no-underline transition duration-300 hover:border-nexus-blue-400 hover:transform hover:-translate-y-1 flex flex-col justify-start items-center">
                        <FaBookOpen className = "text-9xl flex justify-center items-start bg-transparent text-nexus-blue-200 text-opacity-60"/>
                        <div className = "mt-auto w-full py-4 bg-nexus-blue-200 text-nexus-blue-900 flex flex-col justify-end items-center">
                        <h1 className = "text-xl font-bold">Course 3</h1>
                        <Link to = "/section-chat" className = "text-sm transition duration 300 hover:underline hover:text-nexus-blue-400">Section Chat</Link>
                        </div>
                    </button>
                    <button className = "pt-6 h-64 rounded-md bg-transparent border-2 border-nexus-blue-200 no-underline transition duration-300 hover:border-nexus-blue-400 hover:transform hover:-translate-y-1 flex flex-col justify-start items-center">
                        <IoBookOutline className = "text-9xl flex justify-center items-start bg-transparent text-nexus-blue-200 text-opacity-60"/>
                        <div className = "mt-auto w-full py-4 bg-nexus-blue-200 text-nexus-blue-900 flex flex-col justify-end items-center">
                        <h1 className = "text-xl font-bold">Course 4</h1>
                        <Link to = "/section-chat" className = "text-sm transition duration 300 hover:underline hover:text-nexus-blue-400">Section Chat</Link>
                        </div>
                    </button>
                    <button className = "pt-6 h-64 rounded-md bg-transparent border-2 border-nexus-blue-200 no-underline transition duration-300 hover:border-nexus-blue-400 hover:transform hover:-translate-y-1 flex flex-col justify-start items-center">
                        <FaBookOpen className = "text-9xl flex justify-center items-start bg-transparent text-nexus-blue-200 text-opacity-60"/>
                        <div className = "mt-auto w-full py-4 bg-nexus-blue-200 text-nexus-blue-900 flex flex-col justify-end items-center">
                        <h1 className = "text-xl font-bold">Course 5</h1>
                        <Link to = "/section-chat" className = "text-sm transition duration 300 hover:underline hover:text-nexus-blue-400">Section Chat</Link>
                        </div>
                    </button>
                    <button className = "pt-6 h-64 rounded-md bg-transparent border-2 border-nexus-blue-200 no-underline transition duration-300 hover:border-nexus-blue-400 hover:transform hover:-translate-y-1 flex flex-col justify-start items-center">
                        <IoBookOutline className = "text-9xl flex justify-center items-start bg-transparent text-nexus-blue-200 text-opacity-60"/>
                        <div className = "mt-auto w-full py-4 bg-nexus-blue-200 text-nexus-blue-900 flex flex-col justify-end items-center">
                        <h1 className = "text-xl font-bold">Course 6</h1>
                        <Link to = "/section-chat" className = "text-sm transition duration 300 hover:underline hover:text-nexus-blue-400">Section Chat</Link>
                        </div>
                    </button>
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
                    <Link to ="doc-preview" className = "px-4 py-3 rounded-lg bg-nexus-blue-200 text-white fixed bottom-6 right-36 transition duration-300 hover:text-white transform hover:bg-nexus-blue-300">
                    SuperDoc
                    </Link>
                </motion.div>

            </div>
        </div>
    );
};

export default CoursesPage;