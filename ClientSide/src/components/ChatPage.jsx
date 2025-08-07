import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { BASE_URL } from './api.jsx';
import Navbar from './Navbar';

const socket = io('http://localhost:3000'); // Change this to deployed URL when hosting

export const ChatPage = ({ person }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const usertype = localStorage.getItem('userType');

  const receiverId = person?._id;

  // Scroll to bottom when new message is added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!token || !receiverId) return;

    const fetchUser = async () => {
      try {
        const { data: user } = await axios.get(`${BASE_URL}/fetchuserdata/${usertype}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };

    fetchUser();
  }, [token, receiverId, usertype]);

  useEffect(() => {
    if (!currentUser || !receiverId) return;

    socket.emit('join-room', currentUser._id);

    const fetchMessages = async () => {
      try {
        const { data: msgHistory } = await axios.get(`${BASE_URL}/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(msgHistory);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();

    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [currentUser, receiverId]);

  useEffect(() => {
    scrollToBottom(); // Auto scroll on message update
  }, [messages]);

  const sendMessage = async () => {
    if (!msg.trim() || !currentUser || !receiverId) return;

    const messageData = {
      senderId: currentUser._id,
      receiverId,
      content: msg,
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/message`, messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => [...prev, data]);
      socket.emit('send_message', data);
      setMsg('');
    } catch (err) {
      console.error('Message sending failed', err);
    }
  };

  if (!person) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
    

      {/* Chat Section */}
      <div className="flex-1 flex flex-col p-4 bg-gray-50">
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          Chat with {person?.username || person?.name || 'User'}
        </h2>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto border rounded p-3 bg-white shadow space-y-2">
          {messages.map((m, i) => (
            <div key={i} className="relative">
              {i === messages.length - 1 && (
                <div className="text-center text-sm text-gray-400 mb-2">Last message</div>
              )}
              <div
                className={`p-2 rounded max-w-xs break-words ${
                  m.senderId === currentUser?._id
                    ? 'bg-blue-100 self-end text-right ml-auto'
                    : 'bg-gray-200 self-start'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex mt-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border rounded-l p-2 outline-none"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
