import React, { useState, useEffect, useRef} from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import SectionSideBar from '../components/SectionSideBar.jsx';
import Message from "../components/Message.jsx";
import { io } from "socket.io-client";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SectionChat = ({ userId }) => {
    const { roomId } = useParams();
    const location = useLocation();
    const courseState = location.state;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);

    // Extract course information from roomId
    const courseInfo = React.useMemo(() => {
        if (!roomId) return null;
        // Updated regex to handle potential spaces and different formats
        const match = roomId.match(/([A-Z]+)\s*(\d+)\.(\d+)/);
        if (match) {
            return {
                courseCode: match[1],
                courseNumber: match[2],
                section: match[3]
            };
        }
        return null;
    }, [roomId]);

    // Initialize chat and connect to socket
    useEffect(() => {
        console.log('Current roomId:', roomId);
        console.log('Course state:', courseState);
        
        const token = localStorage.getItem('token');
        if (!token || !roomId) {
            console.error('Missing token or roomId');
            return;
        }
      
        const decoded = jwtDecode(token);
        setCurrentUser(decoded.userId);
        setUsername(decoded.username);
    
        // Create formatted room ID
        const formattedRoomId = courseInfo 
            ? `${courseInfo.courseCode}${courseInfo.courseNumber}.${courseInfo.section}`
            : roomId;
      
        console.log('Connecting to socket with:', {
            token,
            roomId: formattedRoomId,
            userId: decoded.userId,
            username: decoded.username
        });
    
        const newSocket = io('http://localhost:3000', {
            query: {
                token,
                roomId: formattedRoomId,
                userId: decoded.userId,
                username: decoded.username
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5
        });
    
        // Add connection event handlers
        newSocket.on('connect', () => {
            console.log('Socket connected successfully');
        });
    
        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    
        newSocket.on('message', (message) => {
            console.log('Received message:', message);
            setMessages(prev => [...prev, {
                messageId: message.messageId,
                userId: message.userId,
                message: message.message,
                timestamp: message.timestamp,
                roomId: message.roomId,
                username: message.username
            }]);
        });
    
        setSocket(newSocket);
        fetchMessages(token, roomId);
    
        return () => {
            if (newSocket) {
                console.log('Cleaning up socket connection');
                newSocket.close();
            }
        };
    }, [roomId, courseInfo]);
    
    const fetchMessages = async (token, roomId) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/chat/messages/${roomId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
   
            const formattedMessages = Array.isArray(response.data.Items) ?
                response.data.Items.map(item => ({
                    messageId: item.messageId,
                    userId: item.userId,
                    message: item.message,
                    timestamp: item.timestamp,
                    roomId: item.roomId,
                    username: item.username 
                })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];
   
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socket || !currentUser || !roomId) return;

        // Create message data with explicit roomId
        const messageData = {
            messageId: `${Date.now()}-${currentUser}`, // Unique message ID
            roomId: roomId, // Explicitly include roomId
            userId: currentUser,
            username: username,
            message: inputMessage.trim(),
            type: 'text',
            timestamp: Date.now()
        };

        try {
            // First, emit to socket for real-time updates
            socket.emit('chatMessage', messageData);

            // Then, save to DynamoDB
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3000/api/chat/messages',
                messageData,
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            // Optionally show an error message to the user
            //alert('Failed to send message. Please try again.');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative">
            <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 z-40"></div>
            <div className="flex min-h-screen pt-16">
                <SectionSideBar
                    selectedCourse={courseInfo ? `${courseInfo.courseCode}${courseInfo.courseNumber}` : ''}
                    onToggle={setIsSidebarCollapsed}
                />
                <div className={`flex-1 bg-gradient-to-br from-nexus-blue-800 via-nexus-blue-900 to-nexus-blue-700 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                    <div className="pt-4 flex flex-col justify-start items-center h-full">
                        <motion.h1
                            className="pb-10 text-white text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            {courseInfo ? `${courseInfo.courseCode} ${courseInfo.courseNumber}.${courseInfo.section} Section Chat` : 'Welcome to Section Chat!'}
                        </motion.h1>
                        <div className="container w-1/2 mx-auto mb-20 space-y-4 overflow-y-auto max-h-[calc(100vh-240px)]">
                            {messages.map((msg, index) => (
                                <Message
                                key={msg.messageId || index}
                                message={{
                                    sender: msg.userId === currentUser ? 'user' : 'other',
                                    text: msg.message,
                                    timestamp: msg.timestamp,
                                    username: msg.username
                                    }}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <motion.div
                            className="fixed bottom-0 left-0 w-full flex justify-center pb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <form onSubmit={sendMessage} className="relative w-1/2">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-1 pl-4 pr-5"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Send a message"
                                />
                                <button 
                                    type="submit" 
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent"
                                >
                                    <IoMdSend className="text-nexus-blue-900 hover:text-nexus-blue-200 cursor-pointer" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionChat;