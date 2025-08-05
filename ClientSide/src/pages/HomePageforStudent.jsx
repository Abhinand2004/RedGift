import React, { useState } from 'react';
import { UserDetails } from '../components/UserDetails';
import ShowAllNotifications from '../components/ShowAllNotifications';
import ShowAllAmbulance from '../components/ShowAllAmbulance';
import Requistacceptstudent from "../components/Requistacceptstudent";
import { SideNav } from '../components/SideNav';

const HomePageforStudent = () => {
  const [selected, setSelected] = useState("Profile"); // Set default to "Profile"

  const COMPONENTS = {
    "Profile": <UserDetails />,
    "Show Requests": <Requistacceptstudent />,
    "Show Announcements": <ShowAllNotifications />,
    "Show Ambulance": <ShowAllAmbulance />
  };

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

export default HomePageforStudent;
