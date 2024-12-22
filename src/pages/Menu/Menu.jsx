import "./Menu.css";
import NMenu from "../../GeneralModules/NavMenu/NavMenu.jsx";
import React, { useState } from "react";
import Lectures from "../../GeneralModules/Lectures/Lectures.jsx";
import { useNavigate } from "react-router-dom";
import PersonalAccount from "../../GeneralModules/PersonalAccount/PersonalAccount.jsx";

export default function Menu() {
  const [activeTab, setActiveTab] = useState("lectures");
  const navigate = useNavigate();
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    // Логика выхода из приложения
    navigate("/");
  };

  return (
    <div>
      <NMenu
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
      <div className="MainMenu">
        {activeTab === "lectures" && <Lectures />}
        {activeTab === "cabinet" && <PersonalAccount />}
      </div>
    </div>
  );
}
