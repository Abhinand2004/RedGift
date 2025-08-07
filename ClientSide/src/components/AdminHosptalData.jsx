import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, GraduationCap, Hospital, CheckCircle, XCircle, Filter, Loader2 } from "lucide-react";
import { BASE_URL } from './api.jsx';

// You'll need to define BASE_URL or import it from your config


const AdminHospitalAndCollegeData = () => {
  const [data, setData] = useState({ colleges: [], hospitals: [] });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/getallhopitalandcollegedata`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('API Response:', response.data);
      
      // Parse the response data based on the actual API structure
      // If response.data is an array of mixed colleges and hospitals
      if (Array.isArray(response.data)) {
        const colleges = response.data.filter(item => item.userType === 'college' || item.type === 'college');
        const hospitals = response.data.filter(item => item.userType === 'hospital' || item.type === 'hospital');
        
        setData({
          colleges: colleges,
          hospitals: hospitals
        });
      } 
      // If response.data has separate arrays for colleges and hospitals
      else if (response.data.colleges || response.data.hospitals) {
        setData({
          colleges: response.data.colleges || [],
          hospitals: response.data.hospitals || []
        });
      }
      // If response.data structure is different, initialize empty arrays
      else {
        setData({
          colleges: [],
          hospitals: []
        });
      }
      
    } catch (err) {
      console.error('Failed to fetch data:', err);
      alert("Failed to fetch data. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApproval(item, type, state) {
    setUpdatingId(item._id);
    try {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      const response = await axios.put(`${BASE_URL}/approverequestbyadmin`, {
        targetId: item._id,
        type: userType,
        state: state
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Update local state after successful API call
      setData(prevData => ({
        ...prevData,
        [type + 's']: prevData[type + 's'].map(dataItem =>
          dataItem._id === item._id ? { ...dataItem, isApproved: state } : dataItem
        )
      }));
      
    } catch (err) {
      console.error('Failed to update approval:', err);
      alert("Failed to update approval. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = (list) => {
    // Ensure list is an array before filtering
    if (!Array.isArray(list)) {
      console.warn('Filter function received non-array:', list);
      return [];
    }
    
    return list.filter((item) => {
      if (search && !item?.name?.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (statusFilter !== "all") {
        if (statusFilter === "true" && item.isApproved !== true) return false;
        if (statusFilter === "false" && item.isApproved !== false) return false;
      }
      return true;
    });
  };

  const renderCards = (list, type) => {
    const filteredList = filtered(list);
    return filteredList.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          {type === "college" ? <GraduationCap size={24} /> : <Hospital size={24} />}
        </div>
        <p className="text-lg font-medium">No {type}s found</p>
        <p className="text-sm text-gray-500">Try adjusting your filters</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {filteredList.map((item) => (
          <div
            key={item._id}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Gradient accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${type === "college" ? "bg-red-100 text-red-600" : "bg-red-100 text-red-600"} group-hover:scale-110 transition-transform duration-300`}>
                    {type === "college" ? <GraduationCap size={24} /> : <Hospital size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                    item.isApproved
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {item.isApproved ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {item.isApproved ? "Approved" : "Pending Review"}
                </span>
              </div>

              <div className="flex gap-3">
                {!item.isApproved ? (
                  <button
                    disabled={updatingId === item._id}
                    onClick={() => handleApproval(item, type, true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {updatingId === item._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {updatingId === item._id ? "Processing..." : "Approve"}
                  </button>
                ) : (
                  <button
                    disabled={updatingId === item._id}
                    onClick={() => handleApproval(item, type, false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {updatingId === item._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {updatingId === item._id ? "Processing..." : "Revoke"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl">
              <Filter className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Admin Approval Panel
            </h1>
          </div>
          <p className="text-gray-600 ml-16">Manage college and hospital approvals with ease</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="college">Colleges</option>
                <option value="hospital">Hospitals</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none mt-7">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none mt-7">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-red-500 mb-4" />
            <p className="text-lg font-medium text-gray-600">Loading data...</p>
            <p className="text-gray-400">Please wait while we fetch the latest information</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Colleges Section */}
            {(typeFilter === "all" || typeFilter === "college") && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <GraduationCap className="text-red-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Colleges
                    <span className="ml-2 text-lg font-normal text-gray-500">
                      ({filtered(data.colleges).length})
                    </span>
                  </h2>
                </div>
                {renderCards(data.colleges, "college")}
              </section>
            )}

            {/* Hospitals Section */}
            {(typeFilter === "all" || typeFilter === "hospital") && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Hospital className="text-red-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Hospitals
                    <span className="ml-2 text-lg font-normal text-gray-500">
                      ({filtered(data.hospitals).length})
                    </span>
                  </h2>
                </div>
                {renderCards(data.hospitals, "hospital")}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHospitalAndCollegeData;