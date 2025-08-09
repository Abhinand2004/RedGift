import React, { useState } from 'react';
import { UserDetails } from '../components/UserDetails';
import GetAllStudents from '../components/GetAllStudents';
import ShowAllNotifications from '../components/ShowAllNotifications';
import { SideNav } from '../components/SideNav';
import ShowAllAmbulance from '../components/ShowAllAmbulance';
import Showmyreq from '../components/Showmyreq';
import { ChatList } from '../components/ChatList';
import { ChatPage } from '../components/ChatPage'; // Import ChatPage
import CreateNewStudents from "../components/CreateNewStudents"
import ShowPendingAcceptedStudents from '../components/ShowPendingAceeptedStudents';
const COMPONENTS = {
  "Profile": <UserDetails />,
  "My Requests": <Showmyreq />,
  "Show Students": <GetAllStudents />,
  "Show Announcements": <ShowAllNotifications />,
  "Show Ambulance": <ShowAllAmbulance />,
  "Create Student":<CreateNewStudents/>,
  "Student Status":<ShowPendingAcceptedStudents/>
};

const HomePageForHospital = () => {
  const [selected, setSelected] = useState("Profile");
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  const handleChatUserSelect = (user) => {
    setSelectedChatUser(user);
  };

  const renderContent = () => {
    if (selected === "Chats") {
      return selectedChatUser ? (
        <ChatPage receiver={selectedChatUser} onBack={() => setSelectedChatUser(null)} />
      ) : (
        <ChatList onSelectChat={handleChatUserSelect} />
      );
    }

    return COMPONENTS[selected] || <div>Select a view</div>;
  };

  return (
    <div className="flex w-screen h-screen">
      <SideNav onSelect={setSelected} selected={selected} />
      <div className="flex-1 ml-20 md:ml-64 p-4 ">
        {renderContent()}
      </div>
    </div>
  );
};

export default HomePageForHospital;
