import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from './api.jsx';

export const EditModal = ({ open, onClose, userData, refreshData }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    address: '',
    pincode: '',
  });

  const [certificate, setCertificate] = useState(null);

  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        state: userData.state || '',
        address: userData.address || '',
        pincode: userData.pincode || '',
      });
    }
  }, [userData]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCertificate(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Add fields
      formData.append('name', form.name);
      formData.append('phone', form.phone);

      if (userType !== 'admin') {
        formData.append('state', form.state);
        formData.append('address', form.address);
        formData.append('pincode', form.pincode);
      }

      // Add file only if userType is hospital
      if (userType === 'hospital' && certificate) {
        formData.append('certificate', certificate);
      }

      const res = await axios.put(
        `${BASE_URL}/edituserdata/${userType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(res.data.msg || 'User data updated');
      refreshData?.();
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(
        error.response?.data?.msg || 'Failed to update user information'
      );
    }
  };

  const editableFields =
    userType === 'admin'
      ? ['name', 'phone']
      : ['name', 'phone', 'state', 'address', 'pincode'];

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Edit Details</h2>

        <div className="grid gap-4">
          {/* Email - always shown and disabled */}
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-500"
          />

          {/* Editable fields */}
          {editableFields.map((field) => (
            <input
              key={field}
              name={field}
              type="text"
              value={form[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ))}

          {/* Hospital-only file upload field */}
          {userType === 'hospital' && (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-red-500 font-medium">
      Upload Certificate <span className="text-gray-500">(PDF only)</span>
    </label>
    <input
      type="file"
      accept=".pdf"
      onChange={handleFileChange}
      className="w-full px-2 py-1 border rounded-md"
    />
    {certificate && certificate.type !== 'application/pdf' && (
      <p className="text-xs text-red-600">⚠ Please upload a valid PDF file</p>
    )}
  </div>
)}

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
