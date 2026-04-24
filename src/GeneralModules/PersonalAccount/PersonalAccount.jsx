import React, { useState, useEffect } from "react";
import "./PersonalAccount.css";
import NavMenu from "../NavMenu/NavMenu";
import { useAuth } from '../../../src/context/AuthContext';

export default function PersonalAccount() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(() => {
    // Загружаем сохранённое фото для этого пользователя
    const storedAvatar = localStorage.getItem(`avatar_${user?.id}`);
    return storedAvatar || "/images/avatar.jpg";
  });
  const [userInfo, setUserInfo] = useState({ name: "", email: "", role: "", group_name: "" });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        group_name: user.group_name || "",
      });
    }
  }, [user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setAvatarUrl(dataUrl);
        localStorage.setItem(`avatar_${user.id}`, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div>
      <NavMenu />
      <div className="container-all">
        <div className="user-info">
          <img src={avatarUrl} alt="Аватар пользователя" className="user-photo" />
          <label htmlFor="avatar-upload" className="button-account">
            Изменить фото
          </label>
          <input
            type="file"
            id="avatar-upload"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
            accept="image/*"
          />
        </div>
        <div className="user-info-details">
          <div className="info-row">
            <span className="info-label">ФИО:</span>
            <span className="info-background">{userInfo.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-background">{userInfo.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Роль:</span>
            <span className="info-background">{userInfo.role === "teacher" ? "Преподаватель" : "Студент"}</span>
          </div>
          {userInfo.role === "student" && (
            <div className="info-row">
              <span className="info-label">Группа:</span>
              <span className="info-background">{userInfo.group_name || "Не указана"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}