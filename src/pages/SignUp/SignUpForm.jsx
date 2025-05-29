import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpForm.css";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    group: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const groups = ["Группа 1", "Группа 2", "Группа 3", "Группа 4"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "email") {
      if (!value.includes("@")) {
        setErrors(prev => ({ ...prev, email: "Email должен содержать @" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.email.includes("@")) {
      setErrors(prev => ({ ...prev, email: "Email должен содержать @" }));
      return;
    }

    
  };

  return (
    <div className="signup-container">
      
      <h2 className="signup-title">РЕГИСТРАЦИЯ</h2>
      
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>ФИО</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Группа</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            required
          >
            <option value="">Выберите группу</option>
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn" onClick={handleSubmit}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}