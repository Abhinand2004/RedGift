import React, { useState } from 'react';
import { UserDetails } from '../components/UserDetails';
import ShowAllNotifications from '../components/ShowAllNotifications';
import ShowAllAmbulance from '../components/ShowAllAmbulance';
import Requistacceptstudent from "../components/Requistacceptstudent";
import { SideNav } from '../components/SideNav';
import { ChatList } from '../components/ChatList';
import { ChatPage } from '../components/ChatPage'; // ✅ Import ChatPage

const HomePageforStudent = () => {
  const [selected, setSelected] = useState("Profile"); 
  const [chatPerson, setChatPerson] = useState(null); // ✅ Manage chat target

  // Views other than Chat
  const COMPONENTS = {
    "Profile": <UserDetails />,
    "Show Requests": <Requistacceptstudent />,
    "Show Announcements": <ShowAllNotifications />,
    "Show Ambulance": <ShowAllAmbulance />,
  };

  return (
    <div className="flex w-screen h-screen">
      {/* Sidebar */}
      <SideNav onSelect={(sel) => {
        setSelected(sel);
        if (sel !== "Chats") setChatPerson(null); // ✅ Reset chat view when leaving Chats
      }} selected={selected} />

      {/* Main content */}
      <div className="flex-1 ml-20 md:ml-64 p-4 overflow-hidden">
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

export default HomePageforStudent;
