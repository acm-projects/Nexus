import React, {useState} from "react";
import { motion } from "framer-motion";
import { IoMdSend } from "react-icons/io";

const SectionChat = () => {
    const [message, setMessage] = useState('');
    return(
        <div className="bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 h-screen w-screen">
            <div className="pt-4 flex flex-col justify-center items-center">
            <motion.h1
                className="pt-20 pb-10 text-white text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                Welcome to Section Chat! Chat with people in your class and section.
            </motion.h1>
        </div>

        <motion.div
            className="fixed bottom-0 left-0 w-full flex justify-center pb-6" // Fixed positioning at the bottom
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <div className="relative w-3/4">
                <input
                    type="text"
                    id="message"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1 pl-4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="send a message"
                />
                <IoMdSend className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-nexus-blue-900 hover:text-nexus-blue-200" />
            </div>
        </motion.div>
        </div>


    );
};
export default SectionChat;