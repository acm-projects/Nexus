import React from "react";

const Message = ({ message }) => {
    const isUser = message.sender === 'user';
    
    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className="flex flex-col">
                <span className={`text-xs text-white/70 mb-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {message.username}
                </span>
                <div className={`p-4 rounded-lg max-w-md ${
                    isUser 
                        ? 'bg-nexus-blue-200 bg-opacity-40 border-2 border-white/20 text-white' 
                        : 'bg-white/10 backdrop-blur-sm border-2 border-white/20 ml-0'
                }`}>
                    <div className={`text-xs text-white/50 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {formatTime(message.timestamp)}
                    </div>
                    <div className="break-words">{message.text}</div>
                </div>
            </div>
        </div>
    );
};

export default Message;