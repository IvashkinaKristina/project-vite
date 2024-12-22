import "./RegistrationForm.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const handleLogin = () => {
    // Здесь можно добавить логику проверки данных для входа, а пока просто перенаправляем
    navigate("/menu");
  };

  return (
    <div className="RegistrForm">
      <div>
        <span className="RegIn">АВТОРИЗАЦИЯ</span>
        <div className="ContainerReg">
          <span className="NameOfSpace">Логин</span>
          <br />
          <input type="text" className="SpaceToEnter" />
          <br />
          <span className="NameOfSpace">Пароль</span>
          <br />
          <input type="password" className="SpaceToEnter" />
        </div>
        <button className="RegButton" onClick={handleLogin}>
          ВХОД
        </button>
      </div>
    </div>
  );
}
