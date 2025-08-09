import React, { useState, useEffect } from "react";
import {
  MdVolunteerActivism,
  MdListAlt,
  MdLocalHospital,
  MdCampaign,
  MdAnnouncement,
  MdPeople,
  MdAssignment,
  MdClose,
  MdMenu,
  MdAccountCircle,
  MdLogout,
   MdMessage,
   MdWorkspacePremium,
   MdFileDownload,
   MdAssessment
} from "react-icons/md";
import { FaAmbulance } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const allNavItems = [
  { label: "Profile", icon: <MdAccountCircle /> },
  { label: "Request Donors", icon: <MdVolunteerActivism />, roles: ["user", "admin", "hospital"] },
  { label: "Show Students", icon: <MdAssignment />, roles: ["college"] },
  { label: "My Requests", icon: <MdListAlt />, roles: ["admin", "user", "hospital"] },
  { label: "Hospital & College", icon: <MdLocalHospital />, roles: ["admin"] },
  { label: "Create Announcement", icon: <MdCampaign />, roles: ["admin"] },
  { label: "Show Announcements", icon: <MdAnnouncement />, roles: ["admin", "user", "hospital", "college", "student"] },
  { label: "Create Ambulance", icon: <FaAmbulance />, roles: ["admin"] },
  { label: "Show Ambulance", icon: <FaAmbulance />, roles: ["admin", "user", "hospital", "college", "student"] },
  { label: "Create Student", icon: <MdPeople />, roles: ["college"] },
  { label: "Show Requests", icon: <MdAssignment />, roles: ["student"] },
  { label: "Student Status", icon: <MdAssessment />, roles: ["college"] },
  { label: "Chats", icon: <MdMessage />, roles: ["hospital", "student", "user"] },
  { label: "Creat Cirtificate", icon: <MdWorkspacePremium />, roles: ["hospital"] },
  { label: "Show Cirtificates", icon: <MdFileDownload />, roles: ["student"] },


];

export const SideNav = ({ onSelect, selected }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const type = localStorage.getItem("userType");
    setUserType(type);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("userType");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Filter items based on userType
  const navItems = allNavItems.filter((item) => {
    if (item.label === "Profile") return true;
    return item.roles?.includes(userType);
  });

  return (
    <div
      className={`h-screen bg-white shadow-md p-4 flex flex-col justify-between fixed top-0 left-0 z-50 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Top Section */}
      <ul className="space-y-3">
        <li
          onClick={toggleSidebar}
          className="flex items-center justify-between p-2 rounded-md hover:bg-red-100 text-gray-700 cursor-pointer transition-all"
        >
          {isOpen ? (
            <>
              <span className="text-sm font-medium text-gray-600">Collapse</span>
              <MdClose className="text-2xl text-red-500" />
            </>
          ) : (
            <MdMenu className="text-2xl text-red-500 mx-auto" />
          )}
        </li>

        {navItems.map((item, idx) => (
          <li
            key={idx}
            onClick={() => onSelect(item.label)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all 
            hover:bg-red-100 text-gray-700 ${
              selected === item.label ? "bg-red-100 font-semibold" : ""
            }`}
          >
            <span className="text-2xl text-red-500">{item.icon}</span>
            <span
              className={`text-sm font-medium ${isOpen ? "block" : "hidden"}`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Bottom Section - Logout */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-2 rounded-md text-red-600 hover:bg-red-100 transition-all"
        >
          <MdLogout className="text-2xl" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};
