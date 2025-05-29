import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpForm.css";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    lastname: "",
    group: "Группа 1",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const groups = ["Группа 1", "Группа 2", "Группа 3", "Группа 4"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.includes("@")) {
      setErrors({ email: "Email должен содержать @" });
      return;
    }

    try {
      // 1. Регистрация
      const regResponse = await axios.post("http://localhost:8000/user/", formData);
      
      if (regResponse.status === 200 || regResponse.status === 201) {
        setIsSuccess(true);
        
        // 2. Авторизация
        const loginData = new FormData();
        loginData.append('username', formData.email);
        loginData.append('password', formData.password);
        
        try {
          const loginResponse = await axios.post(
            "http://localhost:8000/login/token", 
            loginData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          
          // 3. Сохраняем токен
          localStorage.setItem('token', loginResponse.data.access_token);
          
          // 4. Перенаправляем
          setTimeout(() => {
            window.location.href = "/menu";
          }, 1500);
          
        } catch (loginError) {
          console.error("Login error:", loginError);
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        }
      }
    } catch (regError) {
      console.error("Registration error:", regError);
      setErrors({
        server: regError.response?.data?.detail || 
               "Ошибка регистрации. Проверьте данные."
      });
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">РЕГИСТРАЦИЯ</h2>
      
      {isSuccess && (
        <div className="success-message">
          Регистрация успешна! Перенаправляем...
        </div>
      )}
      
      {errors.server && (
        <div className="error-message">{errors.server}</div>
      )}

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>Имя*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={errors.name ? "error-input" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Фамилия*</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            className={errors.surname ? "error-input" : ""}
          />
          {errors.surname && <span className="error-text">{errors.surname}</span>}
        </div>

        <div className="form-group">
          <label>Отчество*</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className={errors.lastname ? "error-input" : ""}
          />
          {errors.lastname && <span className="error-text">{errors.lastname}</span>}
        </div>

        <div className="form-group">
          <label>Группа*</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            required
            className={errors.group ? "error-input" : ""}
          >
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          {errors.group && <span className="error-text">{errors.group}</span>}
        </div>

        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Пароль* (минимум 6 символов)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className={errors.password ? "error-input" : ""}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-btn">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}