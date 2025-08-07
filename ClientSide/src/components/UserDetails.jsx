import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import profileImg from './profileimg.jpg';
import quoteImage from './image1.png';
import axios from 'axios';
import { BASE_URL } from './api.jsx';
import { Email, Phone } from '@mui/icons-material';
import { EditModal } from './Edit.jsx';
import { useNavigate } from 'react-router-dom';

export const UserDetails = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const usertype = localStorage.getItem('userType');
  const token = localStorage.getItem('token');
   
  const fetchData = async () => {
    const token=localStorage.getItem("token")
      if (!token) {
        navigate("/login")
      }
    try {
      const res = await axios.get(`${BASE_URL}/fetchuserdata/${usertype}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setUserData(res.data);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
              navigate("/login")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usertype && token) fetchData();
    else setLoading(false);

  }, [usertype, token]);

  const handleDownloadCertificate = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/certificate/${userData._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download certificate.');
    }
  };

  if (loading) return <div className="text-center py-6 text-gray-500">Loading...</div>;
  if (!userData) return <div className="text-center py-6 text-red-500">Unable to load user data.</div>;

  return (
    <>
      <div className="w-full bg-gray-100 p-4 font-[Poppins] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="RedGift Logo" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-red-600">RedGift</h1>
          </div>
          <div className="hidden md:block text-sm md:text-base text-gray-700 font-medium capitalize">
            User Type: <span className="font-semibold">{usertype}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Left */}
          <div className="w-full md:w-1/4 flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
              <img src={profileImg} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              <h2 className="mt-4 text-lg font-semibold text-gray-800">{userData.name}</h2>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
              <Email className="text-red-500 text-3xl" />
              <p className="mt-2 text-sm text-gray-700">{userData.email}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
              <Phone className="text-red-500 text-3xl" />
              <p className="mt-2 text-sm text-gray-700">{userData.phone}</p>
            </div>
          </div>

          {/* Right */}
          <div className="w-full md:w-3/4 flex flex-col justify-between">
            <div className="flex flex-col-reverse md:flex-row items-center gap-3 bg-white rounded-lg shadow p-6 h-full">
              <div className="flex-1 text-center md:text-left pl-3.5">
                <p className="text-[2rem] md:text-[2.8rem] font-semibold text-red-600 leading-tight italic relative">
                  <span className="text-[5rem] absolute -left-6 -top-10 text-red-300 font-serif hidden md:block">“</span>
                  People live <br /> when people give
                </p>
              </div>
              <div>
                <img src={quoteImage} alt="Quote" className="max-h-80 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {userData.state && (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-red-500 text-lg font-semibold">State</p>
              <p className="mt-2 text-sm text-gray-700">{userData.state}</p>
            </div>
          )}
          {userData.pincode && (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-red-500 text-lg font-semibold">Pincode</p>
              <p className="mt-2 text-sm text-gray-700">{userData.pincode}</p>
            </div>
          )}
          {userData.address && (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-red-500 text-lg font-semibold">Address</p>
              <p className="mt-2 text-sm text-gray-700">{userData.address}</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col md:flex-row justify-end gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Add or Edit Details
          </button>

          {usertype === 'hospital' && userData.certificateUrl && (
            <button
              onClick={handleDownloadCertificate}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Download Certificate
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EditModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userData={userData}
          refreshData={fetchData}
        />
      )}
    </>
  );
};
