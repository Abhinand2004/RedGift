import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from './api.jsx';
import { MdBloodtype } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const usertype = localStorage.getItem('userType');
      const token = localStorage.getItem('token');
      if (!usertype || !token) return;

      try {
        const res = await axios.get(`${BASE_URL}/fetchuserdata/${usertype}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserName(res.data.name || 'User');
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    window.location.reload(); // refresh app
  };

  return (
    <nav className="bg-white border-b border-red-200 shadow-md px-4 sm:px-8 py-3 flex justify-between items-center relative z-50">
      {/* Left: Logo + App Name */}
      <div className="flex items-center space-x-2 text-red-600">
        <MdBloodtype className="text-3xl drop-shadow" />
        <span className="text-xl sm:text-2xl font-bold tracking-wide">RedGift</span>
      </div>

      {/* Right: User Info + Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 px-3 py-2 rounded-xl transition-all duration-200 shadow-sm"
        >
          <span className="text-sm font-semibold text-red-700 hidden sm:block">
            {userName}
          </span>
          <FaUserCircle className="text-2xl text-red-600" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-red-300 rounded-lg shadow-lg animate-fadeIn">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
