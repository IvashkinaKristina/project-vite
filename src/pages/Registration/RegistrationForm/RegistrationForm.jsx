import "./RegistrationForm.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "/src/services/api";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/menu");
    } catch (err) {
      setError("Неверный email или пароль");
    }
  };

  return (
    <div className="RegistrForm">
      <div>
        <span className="RegIn">АВТОРИЗАЦИЯ</span>
        <div className="ContainerReg">
          {error && <div className="error-message">{error}</div>}
          <span className="NameOfSpace">Email</span>
          <br />
          <input 
            type="text" 
            className="SpaceToEnter" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <span className="NameOfSpace">Пароль</span>
          <br />
          <input 
            type="password" 
            className="SpaceToEnter" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="RegButton" onClick={handleLogin}>
          ВХОД
        </button>
      </div>
    </div>
  );
}