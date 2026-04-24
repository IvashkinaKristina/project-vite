import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';  // подключаем стили

export default function Register() {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [groupName, setGroupName] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Собираем полное ФИО
    const fullName = `${lastName} ${firstName} ${patronymic}`.trim().replace(/\s+/g, ' ');
    if (!lastName || !firstName) {
      alert('Пожалуйста, заполните фамилию и имя');
      return;
    }
    try {
      await signUp(email, password, fullName, role, groupName);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>РЕГИСТРАЦИЯ</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
             <label>Фамилия *</label>
            <input
              type="text"
              placeholder="Ваша фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Имя *</label>
            <input
              type="text"
              placeholder="Ваше имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Отчество</label>
            <input
              type="text"
              placeholder="Ваше отчество"
              value={patronymic}
              onChange={(e) => setPatronymic(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Роль</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Студент</option>
              <option value="teacher">Преподаватель</option>
            </select>
          </div>
          {role === 'student' && (
            <div className="input-group">
              <label>Группа</label>
              <input
                type="text"
                placeholder="Название группы"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="login-btn">ЗАРЕГИСТРИРОВАТЬСЯ</button>
        </form>
        <div className="register-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}