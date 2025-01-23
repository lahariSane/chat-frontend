import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import ChatMessage from '../components/Chat/ChatMessage';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null); // State for error messages
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleEndSession = () => {
        localStorage.removeItem('receiver');
        navigate('/');
    };

    const handleSignOut = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            setError('Failed to sign out. Please try again.');
        }
    };

    useEffect(() => {
        async function fetchMessages(user1, user2) {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/fetchMessages?user1=${user1}&user2=${user2}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            "User-Agent": "lahari",
                            'ngrok-skip-browser-warning': 'true',
                        },
                    }
                );
                const data = await response.json();
                setMessages(data);
            } catch (err) {
                setError('Error fetching messages. Please try again later.');
            }
        }

        fetchMessages(localStorage.getItem('user'), localStorage.getItem('receiver'));

        const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socket.emit('join', { userId: localStorage.getItem('user') });
        });

        socket.on('message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setError('Failed to connect to the server. Please check your connection.');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/sendMessage`,
                {
                    sender: localStorage.getItem('user'),
                    receiver: localStorage.getItem('receiver'),
                    message: newMessage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setMessages((prev) => [...prev, response.data]);
            setNewMessage('');
        } catch (err) {
            setError('Failed to send the message. Please try again.');
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        if (isNaN(date)) {
            return 'Invalid date';
        }
        return date.toLocaleString();
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Chat Room</h1>
                <div>
                    <button
                        onClick={handleEndSession}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        End Session
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
            {error && (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md mb-4">
                    {error}
                </div>
            )}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                {messages.length > 0 && messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message.message}
                        sender={message.sender.email}
                        timestamp={formatTimestamp(message.timestamp)}
                        isCurrentUser={message.sender.id === parseInt(localStorage.getItem('user'))}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="border-t p-4 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatRoom;
