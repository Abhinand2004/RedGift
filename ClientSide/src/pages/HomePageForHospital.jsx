import React, { useState } from 'react';
import { UserDetails } from '../components/UserDetails';
import GetAllStudents from '../components/GetAllStudents';
import ShowAllNotifications from '../components/ShowAllNotifications';
import { SideNav } from '../components/SideNav';
import ShowAllAmbulance from '../components/ShowAllAmbulance';
import Showmyreq from '../components/Showmyreq';
import { ChatList } from '../components/ChatList';
import { ChatPage } from '../components/ChatPage'; // ✅ Import this
import AcceptedStudentsWithCertificates from '../components/CreateCetificate';

const COMPONENTS = {
  "Profile": <UserDetails />,
  "My Requests": <Showmyreq />,
  "Request Donors": <GetAllStudents />,
  "Show Announcements": <ShowAllNotifications />,
  "Show Ambulance": <ShowAllAmbulance />,
  "Creat Cirtificate":<AcceptedStudentsWithCertificates/>,
};

const HomePageForHospital = () => {
  const [selected, setSelected] = useState("Profile");
  const [chatPerson, setChatPerson] = useState(null);

  return (
    <div className="flex w-screen h-screen">
      <SideNav onSelect={setSelected} selected={selected} />

      <div className="flex-1 ml-20 md:ml-64 p-4 ">
        {selected === "Chats" && !chatPerson && (
          <ChatList onSelectChat={(person) => setChatPerson(person)} />
        )}

        {selected === "Chats" && chatPerson && (
          <ChatPage person={chatPerson} />
        )}

        {selected !== "Chats" && (COMPONENTS[selected] || <div>Select a view</div>)}
      </div>
    </div>
  );
};

export default HomePageForHospital;
