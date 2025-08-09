import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "./api.jsx";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000"); // Change to deployed URL when hosting

export const ChatPage = ({ person }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const usertype = localStorage.getItem("userType");

  const receiverId = person?._id;

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!token || !receiverId) return;

    const fetchUser = async () => {
      try {
        const { data: user } = await axios.get(
          `${BASE_URL}/fetchuserdata/${usertype}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchUser();
  }, [token, receiverId, usertype]);

  useEffect(() => {
    if (!currentUser || !receiverId) return;

    socket.emit("join-room", currentUser._id);

    const fetchMessages = async () => {
      try {
        const { data: msgHistory } = await axios.get(
          `${BASE_URL}/messages/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(msgHistory);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [currentUser, receiverId]);

  useEffect(() => {
    scrollToBottom();
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

      socket.emit("send_message", data);
      setMsg("");
    } catch (err) {
      console.error("Message sending failed", err);
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
    <div className="flex flex-col h-screen bg-red-50 font-[Poppins]">
      {/* Header */}
      <div className="flex items-center justify-between bg-red-600 text-white px-4 py-3 shadow-md">
        <button
          onClick={() => navigate("/")}
          className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          Home
        </button>
        <h2 className="text-lg font-bold">
          Chat with {person?.username || person?.name || "User"}
        </h2>
        <div className="w-14"></div>
      </div>

      {/* Chat Messages */}
   {/* Chat Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-3">
  {messages.map((m, i) => (
    <div key={i} className="flex flex-col">
      <div
        className={`p-3 rounded-lg w-70 shadow ${
          m.senderId === currentUser?._id
            ? "bg-red-500 text-white self-end"
            : "bg-white text-gray-800 self-start "
        }`}
      >
        {m.content}
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>

      {/* Input Box */}
      <div className="flex p-3 bg-white border-t">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-300 rounded-l px-3 py-2 outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-red-600 text-white px-4 py-2 rounded-r hover:bg-red-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};
