import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './api.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Requistacceptstudent = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(null);
  const [userType, setUserType] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const usertype = localStorage.getItem('userType');
      setUserType(usertype);
      const response = await axios.get(`${BASE_URL}/fetchuserdata/${usertype}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsApproved(response.data.isApproved);
    } catch (error) {
      toast.error('Error fetching user data');
      console.error(error);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/getrequest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data.requests);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isApproved === true) {
      fetchRequests();
    }
  }, [isApproved]);

  const handleAccept = async () => {
    if (!window.confirm("Do you accept the blood donation request from your college?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/updatecollagerequest`, { status: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Request accepted successfully.');
      setIsApproved(true);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update the request');
      console.error(error);
    }
  };

  const handleCancelDonation = async () => {
    if (!window.confirm("Cancel your blood donation participation?")) return;
    setCancelLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/updatecollagerequest`, { status: false }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.info('Donation cancelled.');
      setIsApproved(false);
      setRequests([]);
    } catch (error) {
      toast.error('Failed to cancel donation.');
      console.error(error);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleAcceptIndividual = async (id) => {
    if (!window.confirm("Accept this specific blood donation request?")) return;
    setActionLoadingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/acceptbystudent`, { id, status: 'accepted' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Blood request accepted.');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to accept the request');
      console.error(error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectIndividual = async (id) => {
    if (!window.confirm("Reject this blood donation request?")) return;
    setActionLoadingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/acceptbystudent`, { id, status: 'rejected' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.error('Request rejected.');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject the request');
      console.error(error);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="p-4 font-[Poppins] text-gray-800 bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4 sm:mb-6">Blood Requests</h2>

      {isApproved === null && (
        <div className="bg-white shadow p-4 rounded-lg border-l-4 border-red-500 mb-4">
          <p className="text-sm text-gray-700 mb-3">
            You have a request from your college. By accepting, your details will be public.
          </p>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleAccept}
          >
            Accept Request
          </button>
        </div>
      )}

      {isApproved === false && (
        <div className="bg-yellow-100 p-4 rounded-lg mb-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-800 mb-3">
            You have previously rejected this request. You can accept now if you've changed your mind.
          </p>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleAccept}
          >
            Accept Now
          </button>
        </div>
      )}

      {isApproved === true && (
        <>
          <div className="bg-red-50 border border-red-300 p-4 rounded-lg mb-4">
            <p className="text-sm text-red-700 mb-3">
              Your details are public for blood donation requests. Cancel if you no longer wish to participate.
            </p>
            <button
              className={`w-full sm:w-auto px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 transition ${cancelLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleCancelDonation}
              disabled={cancelLoading}
            >
              {cancelLoading ? 'Cancelling...' : 'Cancel Blood Donation'}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white p-4 rounded-lg shadow text-center py-6">
              <p className="text-gray-600">No blood requests available.</p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-red-100 text-red-700">
                    <tr>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left">Username</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left hidden sm:table-cell">Requested At</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left">Status</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left hidden md:table-cell">Message</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left hidden lg:table-cell">Requester Type</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-center">Action</th>
                    </tr>
                  </thead>
                 <tbody className="divide-y divide-gray-200">
  {requests.map((req) => {
    let rowBg = "";
    if (req.status === "accepted") rowBg = "bg-green-50";
    else if (req.status === "rejected") rowBg = "bg-red-50";
    else rowBg = "bg-yellow-50"; // pending

    return (
      <tr key={req._id} className={`${rowBg} hover:opacity-90`}>
        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
          {req.requestedUsername}
        </td>
        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap hidden sm:table-cell">
          {new Date(req.requestedAt).toLocaleString()}
        </td>
        <td
          className={`px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap capitalize font-semibold
            ${req.status === 'accepted' ? 'text-green-600' :
              req.status === 'rejected' ? 'text-red-600' :
              'text-yellow-600'}`}
        >
          {req.status}
        </td>
        <td className="px-3 py-2 sm:px-4 sm:py-3 hidden md:table-cell">
          <div className="truncate max-w-xs">{req.message}</div>
        </td>
        <td className="px-3 py-2 sm:px-4 sm:py-3 hidden lg:table-cell">{req.requesterType}</td>
        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => handleAcceptIndividual(req._id)}
              disabled={actionLoadingId === req._id}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-600 text-white rounded hover:bg-green-700 transition ${actionLoadingId === req._id ? 'opacity-50' : ''}`}
            >
              {actionLoadingId === req._id ? "..." : "Accept"}
            </button>
            <button
              onClick={() => handleRejectIndividual(req._id)}
              disabled={actionLoadingId === req._id}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition ${actionLoadingId === req._id ? 'opacity-50' : ''}`}
            >
              {actionLoadingId === req._id ? "..." : "Reject"}
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>

                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Requistacceptstudent;
