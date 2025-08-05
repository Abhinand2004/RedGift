import React, { useState } from 'react';
import { UserDetails } from '../components/UserDetails';
import AdminHosptalandCollageData from '../components/AdminHosptalData';
import GetAllStudents from '../components/GetAllStudents';
import Showmyreq from '../components/Showmyreq';
import CreateNotification from '../components/CreateNotification';
import ShowAllNotifications from '../components/ShowAllNotifications';
import CreateAmbulance from '../components/CreateAmbulance';
import ShowAllAmbulance from '../components/ShowAllAmbulance';
import { SideNav } from '../components/SideNav';

const COMPONENTS = {
  "Profile": <UserDetails />,
  "Request Donors": <GetAllStudents />,
  "My Requests": <Showmyreq />,
  "Hospital & College": <AdminHosptalandCollageData />,
  "Create Announcement": <CreateNotification />,
  "Show Announcements": <ShowAllNotifications />,
  "Create Ambulance": <CreateAmbulance />,
  "Show Ambulance": <ShowAllAmbulance />,
};

const HomePageForAdmin = () => {
  const [selected, setSelected] = useState("Profile"); // Changed default from "Request Donors" to "Profile"

  return (
    <div className="flex w-screen h-screen">
      {/* Sidebar */}
      <SideNav onSelect={setSelected} selected={selected} />

      {/* Main content */}
      <div className="flex-1 ml-20 md:ml-64 p-4">
        {COMPONENTS[selected] || <div>Select a view</div>}
      </div>
    </div>
  );
};

export default HomePageForAdmin;
