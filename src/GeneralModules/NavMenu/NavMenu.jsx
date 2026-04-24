import "./NavMenu.css";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../../src/context/AuthContext';

export default function NavMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const getActiveTab = () => {
    if (location.pathname === "/personal-account") return "cabinet";
    if (location.pathname === "/lectures" || location.pathname === "/") return "lectures";
    if (location.pathname === "/create") return "create";
    return "lectures";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab) => {
    switch(tab) {
      case "cabinet":
        navigate("/personal-account");
        break;
      case "lectures":
        navigate("/lectures");
        break;
      case "create":
        navigate("/create");
        break;
      default:
        navigate("/lectures");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="side-nav">
      
      <button
        className={`nav-button ${activeTab === "cabinet" ? "active" : ""}`}
        onClick={() => handleTabChange("cabinet")}
      >
        Личный кабинет
      </button>
      <button
        className={`nav-button ${activeTab === "lectures" ? "active" : ""}`}
        onClick={() => handleTabChange("lectures")}
      >
        Лекции
      </button>
      {user?.role === 'teacher' && (
        <button
          className={`nav-button ${activeTab === "create" ? "active" : ""}`}
          onClick={() => handleTabChange("create")}
        >
          Редактор лекций
        </button>
      )}
      <button className="nav-button-ex" onClick={handleLogout}>
        Выход
      </button>
    </nav>
  );
}