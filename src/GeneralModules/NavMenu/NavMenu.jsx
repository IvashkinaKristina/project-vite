import "./NavMenu.css";
import React from "react";

export default function NavMenu({ activeTab, onTabChange, onLogout }) {
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
            <button className="nav-button-ex" onClick={onLogout}>
                Выход
            </button>
        </nav>
    );
}