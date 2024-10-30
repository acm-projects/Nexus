import React from "react";

const Message = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-lg ${isUser ? 'bg-nexus-blue-200 bg-opacity-40 border-2 border-white/20 text-white' : 'bg-white/10 backdrop-blur-sm border-2 border-white/20 ml-0'}`}>
            {message.text}
            </div>
        </div>
    );
};
export default Message;