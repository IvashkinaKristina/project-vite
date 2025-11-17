import "./NavMenu.css";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; //добавила


/*export default function NavMenu({ activeTab, onTabChange, onLogout }) { */
  
// Добавила
export default function NavMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  
// Определяем активную вкладку по текущему URL (Добавила 17.11.25)
  const getActiveTab = () => {
    if (location.pathname === "/personal-account") return "cabinet";
    if (location.pathname === "/lectures" || location.pathname === "/") return "lectures";
    if (location.pathname === "/create") return "create";
    return "lectures";
  };

   const activeTab = getActiveTab();

  // Функция для перехода по страницам
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
    console.log("Выход из системы");
    // Добавить логику выхода (пока ее нет)
  };

  //Был код
    return (
        <nav className="side-nav">
            <button
                className={`nav-button ${activeTab === "cabinet" ? "active" : ""}`}
                onClick={() => handleTabChange("cabinet")}
            >
                ЛК
            </button>
            <button
                className={`nav-button ${activeTab === "lectures" ? "active" : ""}`}
                onClick={() => handleTabChange("lectures")}
            >
                Лекции
            </button>
            <button
                className={`nav-button ${activeTab === "create" ? "active" : ""}`}
                onClick={() => handleTabChange("create")}
            >
                Редактор лекций
            </button>
            <button className="nav-button-ex" onClick={handleLogout}>
                Выход
            </button>
        </nav>
    );
}