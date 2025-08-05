import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './api.jsx';

const CreateNotification = () => {
  const [formData, setFormData] = useState({
    announcement: '',
    startDate: '',
    lastDate: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BASE_URL}/createnotification`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setMessage(res.data.message);
      setFormData({ announcement: '', startDate: '', lastDate: '' });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong while creating notification'
      );
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-10 bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white bg-opacity-90 backdrop-blur-md border border-red-100 shadow-xl rounded-xl p-6 md:p-10 font-[Poppins]">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-6 tracking-wider">Create Notification</h2>

        {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Announcement</label>
            <textarea
              name="announcement"
              value={formData.announcement}
              onChange={handleChange}
              rows="4"
              placeholder="Type your message here..."
              className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-300 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Last Date</label>
              <input
                type="date"
                name="lastDate"
                value={formData.lastDate}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-red-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-red-700 transition-all duration-200"
          >
            Publish Notification
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNotification;
