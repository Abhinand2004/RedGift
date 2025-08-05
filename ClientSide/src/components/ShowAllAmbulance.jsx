import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './api.jsx';
import {
  Search, Truck, MapPin, User, Phone, Calendar, Trash2, AlertTriangle, RefreshCw
} from 'lucide-react';

const ShowAllAmbulance = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [userType, setUserType] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    setUserType(localStorage.getItem('userType'));
  }, []);

  useEffect(() => {
    fetchAmbulances();
  }, [refresh]);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(ambulances);
    } else {
      const result = ambulances.filter((a) =>
        a.area.toLowerCase().includes(search.trim().toLowerCase()) ||
        a.vehicleName.toLowerCase().includes(search.trim().toLowerCase()) ||
        a.driverName.toLowerCase().includes(search.trim().toLowerCase()) ||
        a.vehicleNumber.toLowerCase().includes(search.trim().toLowerCase())
      );
      setFiltered(result);
    }
  }, [search, ambulances]);

  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getambulances`);
      setAmbulances(res.data.ambulances || []);
      setFiltered(res.data.ambulances || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch ambulances');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this ambulance from the fleet?')) return;

    setDeletingId(id);
    try {
      await axios.delete(`${BASE_URL}/deleteambulance`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ambulanceId: id },
      });
      setRefresh(prev => !prev);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete ambulance');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => setRefresh(prev => !prev);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Loading Fleet Data...</h3>
          <p className="text-gray-500">Fetching ambulance information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
                <Truck className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                  Ambulance Fleet
                </h1>
                <p className="text-gray-600">
                  {filtered.length} ambulances available for emergency response
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-200 hover:border-red-300 text-red-600 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by area, vehicle, driver, or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Ambulance Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Truck size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Ambulances Found</h3>
            <p className="text-gray-500 mb-6">
              {search ? 'Try adjusting your search criteria' : 'No ambulances are currently registered in the system'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((amb) => (
              <div
                key={amb._id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                      <Truck className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{amb.vehicleName}</h3>
                      <p className="text-red-100 text-sm">{amb.vehicleNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <MapPin className="text-red-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Service Area</p>
                      <p className="text-gray-900">{amb.area}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <User className="text-red-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Driver</p>
                      <p className="text-gray-900">{amb.driverName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Phone className="text-red-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Contact</p>
                      <p className="text-gray-900">{amb.driverPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Calendar className="text-red-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Added</p>
                      <p className="text-gray-900">{new Date(amb.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {userType === 'admin' && (
                    <div className="pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleDelete(amb._id)}
                        disabled={deletingId === amb._id}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        {deletingId === amb._id ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            <span>Removing...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 size={16} />
                            <span>Remove from Fleet</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllAmbulance;
