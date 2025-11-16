import "./NavMenu.css";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ДОБАВИТЬ


export default function NavMenu({ activeTab, onTabChange, onLogout }) {
      const navigate = useNavigate(); // ДОБАВИТЬ
  const location = useLocation(); // ДОБАВИТЬ

  // ДОБАВИТЬ: определяем активную вкладку по текущему URL
  const getActiveTab = () => {
    if (location.pathname === "/personal-account") return "cabinet";
    if (location.pathname === "/lectures" || location.pathname === "/") return "lectures";
    if (location.pathname === "/create") return "create";
    return "lectures";
  };

  // ДОБАВИТЬ: функция перехода по страницам
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

  const handleLogout = () => {
    console.log("Выход");
    // логика выхода
  };
    return (
        <nav className="side-nav">
            <button
                className={`nav-button ${activeTab === "cabinet" ? "active" : ""}`}
                onClick={() => onTabChange("cabinet")}
            >
                ЛК
            </button>
            <button
                className={`nav-button ${activeTab === "lectures" ? "active" : ""}`}
                onClick={() => onTabChange("lectures")}
            >
                Лекции
            </button>
            <button
                className={`nav-button ${activeTab === "create" ? "active" : ""}`}
                onClick={() => onTabChange("create")}
            >
                Редактор лекций
            </button>
            <button className="nav-button-ex" onClick={onLogout}>
                Выход
            </button>
        </nav>
    );
}