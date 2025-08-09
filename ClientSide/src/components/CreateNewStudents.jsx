import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './api.jsx';
import {
  User, Mail, Phone, MapPin, Droplets,
  Home, Globe, Plus, XCircle
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateNewStudents = () => {
  const [userType, setUserType] = useState('');
  const [isApproved, setIsApproved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    bloodGroup: '', address: '', pincode: '', state: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const type = localStorage.getItem('userType') || '';
      setUserType(type);

      if (!token || !type) {
        setIsApproved(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/fetchuserdata/${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data;
        setIsApproved(userData.isApproved);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsApproved(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    setSubmitting(true);

    try {
      const res = await axios.post(`${BASE_URL}/addstudent`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.data.success) {
        toast.success('✅ Student added successfully!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored'
        });

        setFormData({
          name: '', email: '', phone: '',
          bloodGroup: '', address: '', pincode: '', state: ''
        });
      } else {
        toast.error(res.data.message || '❌ Something went wrong.', {
          position: 'top-center',
          theme: 'colored'
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Failed to add student.', {
        position: 'top-center',
        theme: 'colored'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (userType !== 'college') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-sm w-full text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h3>
          <p className="text-gray-700 text-base">Only college users can add students.</p>
        </div>
      </div>
    );
  }

  if (isApproved === true) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <ToastContainer />
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-red-600 mb-8 text-center">Add Student</h1>

          <div className="space-y-5">
            {/* Name */}
            <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-red-400 transition">
              <User className="w-6 h-6 text-red-600 mr-4 flex-shrink-0" />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg"
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-red-400 transition">
              <Mail className="w-6 h-6 text-red-600 mr-4 flex-shrink-0" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg"
                required
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-red-400 transition">
              <Phone className="w-6 h-6 text-red-600 mr-4 flex-shrink-0" />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg"
                required
              />
            </div>

            {/* Blood Group */}
            <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-red-400 transition">
              <Droplets className="w-6 h-6 text-red-600 mr-4 flex-shrink-0" />
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="flex-1 outline-none text-gray-800 bg-transparent text-lg"
                required
              >
                <option value="" disabled>Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Address */}
            <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-red-400 transition">
              <Home className="w-6 h-6 text-red-600 mr-4 flex-shrink-0" />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg"
                required
              />
            </div>

            {/* Pincode */}
            <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-red-400 transition">
              <MapPin className="w-6 h-6 text-red-600 mr-4 flex-shrink-0" />
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg"
                required
              />
            </div>

            {/* State */}
            <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-red-400 transition">
              <Globe className="w-6 h-6 text-red-600 mr-4 flex-shrink-0" />
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Student</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isApproved === false) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-600 mb-3">Request Rejected</h3>
          <p className="text-gray-700 text-lg">You can't create a student because admin rejected your request.</p>
        </div>
      </div>
    );
  }

  // isApproved === null (under review)
  return (
    <div className="h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center border-2 border-yellow-400">
        <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-yellow-600 mb-3">Request Under Review</h3>
        <p className="text-gray-800 text-lg leading-relaxed">
          Your request is under review. Please wait for admin approval.
        </p>
      </div>
    </div>
  );
};

export default CreateNewStudents;
