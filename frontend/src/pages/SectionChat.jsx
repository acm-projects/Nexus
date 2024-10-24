import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";
import axios from "axios";
import { useLocation, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SectionChat = ({ userId }) => {
    
    const { roomId } = useParams(); // Assuming roomId is the courseCode.courseNumber.section
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    // Initialize chat and connect to socket
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Get user info from token
        const decoded = jwtDecode(token);
        setCurrentUser(decoded.userId); // or whatever field contains the user ID

        // Connect to socket for real-time messaging
        const newSocket = io('http://localhost:3000', { // Hard-coded server URL
            query: { 
                token,
                roomId,
                userId: decoded.userId
            }
        });

        // Listen for new messages
        newSocket.on('message', (message) => {
            setMessages(prev => [...prev, {
                messageId: message.messageId,
                userId: message.userId,
                message: message.message,
                timestamp: message.timestamp,
                roomId: message.roomId
            }]);
        });

        setSocket(newSocket);

        // Fetch existing messages
        fetchMessages(token, roomId);

        return () => {
            if (newSocket) newSocket.close();
        };
    }, [roomId]);

    // Fetch messages from DynamoDB
    const fetchMessages = async (token, roomId) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/chat/messages/${roomId}`, // Hard-coded URL
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // Transform DynamoDB messages
            const formattedMessages = response.data.Items
                .map(item => ({
                    messageId: item.messageId?.S,
                    userId: item.userId.S,
                    message: item.message.S,
                    timestamp: item.timestamp.S,
                    roomId: item.roomId.S
                }))
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Send message function
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socket || !currentUser) return;

        const messageData = {
            roomId,
            userId: currentUser,
            message: inputMessage.trim(),
            timestamp: new Date().toISOString()
        };

        try {
            // Emit to socket for real-time updates
            socket.emit('chatMessage', messageData);

            // Save to DynamoDB
            await axios.post(
                'http://localhost:3000/api/chat/messages', // Hard-coded URL
                messageData,
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );

            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return(
        <div className="bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 h-screen w-screen flex flex-col">
        <motion.h1
            className="pt-20 pb-10 text-white text-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            {location.state?.courseName} - Section {location.state?.section} Chat
        </motion.h1>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
            {messages.map((msg, index) => (
                <motion.div 
                    key={msg.messageId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.userId === currentUser ? 'justify-end' : 'justify-start'}`}
                >
                    <div 
                        className={`max-w-[70%] ${
                            msg.userId === currentUser 
                                ? 'bg-nexus-blue-200 text-nexus-blue-900' 
                                : 'bg-white text-nexus-blue-900'
                        } rounded-2xl px-4 py-2 shadow-md`}
                    >
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-semibold">
                                {msg.userId === currentUser ? 'You' : `User ${msg.userId.slice(0, 8)}`}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(msg.timestamp).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </span>
                        </div>
                        <p className="text-sm break-words">{msg.message}</p>
                    </div>
                </motion.div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <motion.div
            className="p-4 bg-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <form onSubmit={sendMessage} className="relative flex items-center">
                <input
                    type="text"
                    className="block w-full rounded-full border-0 bg-white/90 px-4 py-3 pr-12 text-nexus-blue-900 placeholder-nexus-blue-400 shadow-lg focus:ring-2 focus:ring-nexus-blue-300 focus:ring-offset-2"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button 
                    type="submit" 
                    className="absolute right-3 p-2 rounded-full bg-nexus-blue-500 text-white hover:bg-nexus-blue-600 transition-colors duration-200"
                    disabled={!inputMessage.trim()}
                >
                    <IoMdSend className="w-5 h-5" />
                </button>
            </form>
            {isTyping && (
                <div className="text-xs text-white/70 mt-1 ml-4">
                    Someone is typing...
                </div>
            )}
        </motion.div>
    </div>

    );
};
export default SectionChat;