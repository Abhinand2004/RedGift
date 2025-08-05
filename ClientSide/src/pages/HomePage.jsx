import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import HomePageforStudent from './HomePageforStudent';
import HomePageForAdmin from './HomePageForAdmin';
import HomePageForCollege from './HomePageForCollege';
import HomePageForHospital from './HomePageForHospital';
import HomePageForUser from './HomePageForUser';

export const HomePage = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("userType");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [navigate, user, token]);

  return (
    <div>
      {user === "student" && <HomePageforStudent />}
      {user === "admin" && <HomePageForAdmin />}
      {user === "college" && <HomePageForCollege />}
      {user === "hospital" && <HomePageForHospital />}
      {user === "user" && <HomePageForUser />}
    </div>
  );
};
