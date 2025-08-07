import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatPage } from './ChatPage'; // Importing ChatPage

export const ChatList = () => {
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null); // New state to manage selected chat user

  const fetchChatList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/chatlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching chat list:', error);
      setError('Failed to load chats.');
      setChatUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  const handleChatClick = (person) => {
    setSelectedPerson(person); // Just like handleMessage in Showmyreq
  };

  // If a chat user is selected, show ChatPage
  if (selectedPerson) {
    return <ChatPage person={selectedPerson} />;
  }

  // Default UI: Chat List
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 bg-gray-50 min-h-screen font-[Poppins]">
      <h2 className="text-3xl font-bold text-blue-600 tracking-wide mb-6">Your Chats</h2>

      {loading && <p className="text-center text-gray-500">Loading chats...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && chatUsers.length === 0 && (
        <p className="text-center text-gray-600">No chats available.</p>
      )}

      <div className="flex flex-col gap-4">
        {chatUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => handleChatClick(user)}
            className="bg-white w-full shadow-md rounded-lg p-4 hover:shadow-lg cursor-pointer transition duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-gray-800 text-sm font-medium">
                {user.username || user.name}
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:underline">Chat</button>
          </div>
        ))}
      </div>
    </div>
  );
};
