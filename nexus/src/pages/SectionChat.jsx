import React, {useState} from "react";
import { motion } from "framer-motion";
import { IoMdSend } from "react-icons/io";
import SectionSideBar from '../components/SectionSideBar.jsx';
import Message from "../components/Message.jsx";

const SectionChat = () => {
    const [message, setMessage] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(1);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const courses = [1, 2, 3, 4, 5, 6];
    const samples = [
        {sender: 'user', text: 'Hi'},
        {sender: 'other', text: 'hola'}
    ];

    const handleCourseChange = (courseNumber) => {
        setSelectedCourse(courseNumber);
    };

    return(
        <div className="relative">
            <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 z-40"></div>
            <div className="flex min-h-screen pt-16">
                <SectionSideBar 
                    courses={courses}
                    selectedCourse={selectedCourse}
                    onCourseChange={handleCourseChange}
                    onToggle={setIsSidebarCollapsed}
                />
                <div className={`flex-1 bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                    <div className="pt-4 flex flex-col justify-center items-center h-full">
                        <motion.h1
                            className="pb-10 text-white text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            Welcome to Section Chat! Chat with people in your class and section.
                        </motion.h1>
                        <div className = "container w-3/4 mx-auto">
                            {samples.map((message, index) => (
                                <Message key={index} message={message} />
                            ))}
                        </div>
                        <motion.div
                            className="fixed bottom-0 left-0 w-full flex justify-center pb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <div className="relative w-3/4">
                                <input
                                    type="text"
                                    id="message"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1 pl-4 pr-5"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="send a message"
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent">
                                    <IoMdSend className="text-nexus-blue-900 hover:text-nexus-blue-200 cursor-pointer" />
                                 </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionChat;