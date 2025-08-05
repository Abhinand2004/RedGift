// import React from 'react'
// import { UserDetails } from '../components/UserDetails'
// import GetAllStudents from '../components/GetAllStudents'
// import ShowAllAmbulance from '../components/ShowAllAmbulance'
// import Showmyreq from '../components/Showmyreq'
// import Navbar from '../components/Navbar'

// const HomePageForUser = () => {
//   return (
//     <div>
//         <UserDetails/>
//         <GetAllStudents/>
//         <Showmyreq/>
//         <ShowAllAmbulance/>
        
//     </div>
//   )
// }

// export default HomePageForUser


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
  "Profile":<UserDetails/>,
  "Request Donors":<GetAllStudents />,
  "My Requests": <Showmyreq />,
  "Show Announcements": <ShowAllNotifications />,
  "Show Ambulance": <ShowAllAmbulance />,
};

const HomePageForUser = () => {
  const [selected, setSelected] = useState("Request Donors");

  return (
    <div className="flex w-screen h-screen ">
      {/* Sidebar */}
      <SideNav onSelect={setSelected} selected={selected} />

      {/* Main content */}
      <div className="flex-1 ml-20 md:ml-64  p-4">
        {COMPONENTS[selected] || <div>Select a view</div>}
      </div>
    </div>
  );
};

export default HomePageForUser;
