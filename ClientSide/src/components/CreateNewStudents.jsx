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
  const [isApproved, setIsApproved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    bloodGroup: '', address: '', pincode: '', state: ''
  });

  useEffect(() => {
    const type = localStorage.getItem('userType');
    const approved = localStorage.getItem('isApproved') === 'true';
    setUserType(type || '');
    setIsApproved(approved || true); // Fallback to true for demo
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

  if (!isApproved) {
    return (
      <div className="h-screen flex items-center justify-center p-4 bg-white">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-500 mb-2">Not Approved</h3>
          <p className="text-gray-600">Please wait for admin approval</p>
        </div>
      </div>
    );
  }

  if (userType !== 'college') {
    return (
      <div className="h-screen flex items-center justify-center p-4 bg-white">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-500 mb-2">Access Denied</h3>
          <p className="text-gray-600">Only college users can add students</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <ToastContainer />
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-red-500">Add Student</h1>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center border border-gray-200 rounded-lg p-3">
            <User className="w-5 h-5 text-red-500 mr-3" />
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="flex-1 outline-none text-gray-700"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-200 rounded-lg p-3">
            <Mail className="w-5 h-5 text-red-500 mr-3" />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="flex-1 outline-none text-gray-700"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border border-gray-200 rounded-lg p-3">
            <Phone className="w-5 h-5 text-red-500 mr-3" />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="flex-1 outline-none text-gray-700"
              required
            />
          </div>

          {/* Blood Group */}
          <div className="flex items-center border border-gray-200 rounded-lg p-3">
            <Droplets className="w-5 h-5 text-red-500 mr-3" />
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="flex-1 outline-none text-gray-700 bg-transparent"
              required
            >
              <option value="">Select Blood Group</option>
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
          <div className="flex items-center border border-gray-200 rounded-lg p-3">
            <Home className="w-5 h-5 text-red-500 mr-3" />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="flex-1 outline-none text-gray-700"
              required
            />
          </div>

          {/* Pincode */}
          <div className="flex items-center border border-gray-200 rounded-lg p-3">
            <MapPin className="w-5 h-5 text-red-500 mr-3" />
            <input
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="flex-1 outline-none text-gray-700"
              required
            />
          </div>

          {/* State */}
          <div className="flex items-center border border-gray-200 rounded-lg p-3">
            <Globe className="w-5 h-5 text-red-500 mr-3" />
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="flex-1 outline-none text-gray-700"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Add Student
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewStudents;
