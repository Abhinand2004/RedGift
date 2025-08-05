import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './api.jsx';
import { MdDelete, MdNotificationsActive } from 'react-icons/md';

const ShowAllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/showallnotifications`);
        setNotifications(res.data.notifications || []);
        setError('');
      } catch (err) {
        setError(
          err.response?.data?.message || 'Error fetching notifications'
        );
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/deletenotifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          notificationId: id
        }
      });

      setRefresh(prev => !prev);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-10 font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-red-600 flex items-center gap-3 mb-10">
          <MdNotificationsActive className="text-5xl" />
          All Notifications
        </h2>

        {/* Error */}
        {error && <p className="text-lg text-red-500 mb-6">{error}</p>}

        {/* No notifications */}
        {notifications.length === 0 ? (
          <p className="text-lg text-gray-500">No notifications found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl transition-all"
              >
                <div className="mb-4 space-y-1">
                  <p className="text-lg text-gray-800">
                    <strong>Announcement:</strong> {n.announcement}
                  </p>
                  <p className="text-base text-gray-600">
                    <strong>Admin:</strong> {n.adminName}
                  </p>
                </div>

                <div className="text-base text-gray-600 space-y-1">
                  <p><strong>Start:</strong> {new Date(n.startDate).toLocaleDateString()}</p>
                  <p><strong>End:</strong> {new Date(n.lastDate).toLocaleDateString()}</p>
                  <p><strong>Created:</strong> {new Date(n.createdAt).toLocaleString()}</p>
                </div>

                {userType === 'admin' && (
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-md flex items-center justify-center gap-2 text-lg font-medium transition"
                  >
                    <MdDelete className="text-xl" />
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllNotifications;
