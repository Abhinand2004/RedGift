import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./api.jsx";
import RequestModal from "./RequestModal";
import { Search, Users, Droplet, UserPlus, Loader2, AlertCircle } from "lucide-react";

const GetAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [search, setSearch] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");

  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;

    if (search.trim()) {
      result = result.filter((student) =>
        student.name?.toLowerCase().includes(search.toLowerCase()) ||
        student.email?.toLowerCase().includes(search.toLowerCase()) ||
        student.bloodGroup?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (bloodGroupFilter !== "all") {
      result = result.filter((student) => student.bloodGroup === bloodGroupFilter);
    }

    setFiltered(result);
  }, [search, bloodGroupFilter, students]);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/getallstudent/${userType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setStudents(res.data || []);
    } catch (err) {
      setError("Failed to fetch students");
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  const canRequest = userType === "hospital" || userType === "user" || userType === "admin";

  const handleRequestClick = (studentId) => {
    setSelectedStudentId(studentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudentId(null);
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-red-500 mb-4" />
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <RequestModal open={modalOpen} onClose={handleCloseModal} studentId={selectedStudentId} />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Blood Donors</h1>
          <p className="text-gray-600">Student blood donor directory</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <select
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Blood Groups</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <AlertCircle className="text-red-600" size={24} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Student Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Users className="text-red-600" size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  </div>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {student.bloodGroup}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Droplet className="text-red-500" size={16} />
                    <span className="text-gray-700">{student.bloodGroup}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">{student.email}</span>
                  </div>
                </div>

                {canRequest && (
                  <button
                    onClick={() => handleRequestClick(student._id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                  >
                    <UserPlus size={16} />
                    Request
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

export default GetAllStudents;
