import React from "react";
import { motion } from "framer-motion";

const SectionChat = () => {
    return(
        <div className="bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 h-screen w-screen">
            <motion.h1
                    className="pt-20 pb-10 font-bold text-white text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                Welcome to Section Chat! Chat with people your class and section.
            </motion.h1>
        </div>
    );
};
export default SectionChat;