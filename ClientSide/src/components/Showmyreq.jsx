import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './api.jsx';
import { ChatPage } from './ChatPage';
import {
  MdBloodtype,
  MdMessage,
  MdAccessTime,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdPinDrop,
  MdMap,
  MdChat,
} from 'react-icons/md';

const Showmyreq = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null); // New state to hold selected student

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/showmyrequest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const acceptedRequests = (res.data.requests || []).filter(req => req.status === 'accepted');
        setRequests(acceptedRequests);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching requests');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleMessage = (student) => {
    setSelectedPerson(student); // Set selected student instead of navigating
  };

  // If person is selected, show chat directly
  if (selectedPerson) {
    return <ChatPage person={selectedPerson} />;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6 bg-gray-50 min-h-screen font-[Poppins]">
      <h2 className="text-3xl font-bold text-red-600 tracking-wide mb-6">Accepted Blood Requests</h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && requests.length === 0 && (
        <p className="text-center text-gray-600">No accepted requests found.</p>
      )}

      <div className="flex flex-col gap-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white w-full shadow-lg rounded-xl p-6 border-l-4 border-green-500 hover:shadow-2xl transition duration-300"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4 items-start">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MdBloodtype className="text-red-500 text-2xl" />
                <span className="text-sm font-bold px-4 py-1 rounded-full uppercase border bg-green-100 text-green-700 border-green-500">
                  Accepted
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MdAccessTime className="text-red-500 text-xl" />
                <span>
                  <strong>Requested:</strong>{' '}
                  {new Date(req.requestedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-gray-700 mb-4">
              <div className="flex items-start gap-2 text-sm">
                <MdMessage className="text-red-500 text-xl mt-0.5" />
                <span>
                  <strong>Message:</strong> {req.message}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
              <h4 className="text-md font-semibold text-red-500 mb-2">Student Details</h4>

              {Array.isArray(req.student) && req.student.length > 0 ? (
                req.student.map((stud, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <MdPerson className="text-red-400" />
                      <span><strong>Name:</strong> {stud.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdEmail className="text-red-400" />
                      <span><strong>Email:</strong> {stud.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdBloodtype className="text-red-400" />
                      <span><strong>Blood Group:</strong> {stud.bloodGroup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdPhone className="text-red-400" />
                      <span><strong>Phone:</strong> {stud.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdLocationOn className="text-red-400" />
                      <span><strong>Address:</strong> {stud.address || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdPinDrop className="text-red-400" />
                      <span><strong>Pincode:</strong> {stud.pincode || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdMap className="text-red-400" />
                      <span><strong>State:</strong> {stud.state || 'N/A'}</span>
                    </div>

                    <div className="col-span-full flex justify-end mt-2">
                      <button
                        onClick={() => handleMessage(stud)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                      >
                        <MdChat className="text-lg" />
                        Message
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-red-500 text-sm">Student details not found.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Showmyreq;
