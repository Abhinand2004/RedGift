import React, { useState } from 'react';
import axios from 'axios';
import { Truck, MapPin, User, Hash, Phone, Plus, Loader2 } from 'lucide-react';
import { BASE_URL } from './api.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateAmbulance = () => {
  const [formData, setFormData] = useState({
    vehicleName: '',
    area: '',
    driverName: '',
    vehicleNumber: '',
    driverPhone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(`${BASE_URL}/addambulance`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success(res.data.message || 'Ambulance added successfully!');
      setFormData({
        vehicleName: '',
        area: '',
        driverName: '',
        vehicleNumber: '',
        driverPhone: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add ambulance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    {
      name: 'vehicleName',
      label: 'Vehicle Name',
      placeholder: 'Enter ambulance model/name',
      icon: Truck,
      type: 'text'
    },
    {
      name: 'area',
      label: 'Service Area',
      placeholder: 'Enter coverage area',
      icon: MapPin,
      type: 'text'
    },
    {
      name: 'driverName',
      label: 'Driver Name',
      placeholder: 'Enter driver full name',
      icon: User,
      type: 'text'
    },
    {
      name: 'vehicleNumber',
      label: 'Vehicle Number',
      placeholder: 'Enter vehicle registration number',
      icon: Hash,
      type: 'text'
    },
    {
      name: 'driverPhone',
      label: 'Driver Phone',
      placeholder: 'Enter 10-digit phone number',
      icon: Phone,
      type: 'tel',
      pattern: '[0-9]{10}',
      title: 'Enter a 10-digit phone number'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2">
            Add New Ambulance
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <Truck size={24} />
              <span className="font-semibold text-lg">Fleet Registration</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {inputFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">{field.label}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon className="text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" size={20} />
                      </div>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        pattern={field.pattern}
                        title={field.title}
                        required
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span>Adding to Fleet...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={24} />
                      <span>Add Ambulance</span>
                    </>
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({
                  vehicleName: '',
                  area: '',
                  driverName: '',
                  vehicleNumber: '',
                  driverPhone: ''
                })}
                className="bg-white border-2 border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-600 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Admin Access Only — Verify all ambulance details before submitting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAmbulance;
