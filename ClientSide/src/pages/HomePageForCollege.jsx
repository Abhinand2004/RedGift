import React, { useState } from 'react';
import { UserDetails } from '../components/UserDetails';
import GetAllStudents from '../components/GetAllStudents';
import CreateNewStudents from '../components/CreateNewStudents';
import ShowPendingAcceptedStudents from '../components/ShowPendingAceeptedStudents';
import ShowAllNotifications from '../components/ShowAllNotifications';
import { SideNav } from '../components/SideNav';
import ShowAllAmbulance from '../components/ShowAllAmbulance';

const COMPONENTS = {
  "Profile": <UserDetails />,
  "Create Student": <CreateNewStudents />,
  "Request Donors": <GetAllStudents />,
  "Student Status": <ShowPendingAcceptedStudents />,
  "Show Announcements": <ShowAllNotifications/>,
    "Show Ambulance": <ShowAllAmbulance />,
};

const HomePageForCollege = () => {
  const [selected, setSelected] = useState("Profile");

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

export default HomePageForCollege;
