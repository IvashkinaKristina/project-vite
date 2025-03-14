import React, { useState, useEffect } from "react";
import "./PersonalAccount.css";

// Путь к аватарке по умолчанию из папки public
const defaultAvatar = "/images/avatar.jpg"; // Изменили ссылку на локальную картинку

export default function PersonalAccount() {
  const [avatarUrl, setAvatarUrl] = useState(() => {
    // Получаем аватар из Local Storage при инициализации
    const storedAvatar = localStorage.getItem("avatar");
    return storedAvatar || defaultAvatar; // Если нет в Local Storage - берем дефолтную
  });

  useEffect(() => {
    // Сохраняем аватар в Local Storage при изменении
    localStorage.setItem("avatar", avatarUrl);
  }, [avatarUrl]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]; // Получаем выбранный файл

    if (file) {
      const reader = new FileReader(); // Создаем FileReader

      reader.onloadend = () => {
        setAvatarUrl(reader.result); // Устанавливаем data URL как новый аватар
      };

      reader.readAsDataURL(file); // Читаем файл как data URL
    }
  };

  return (
    <div className="container-all">
      <div className="user-info">
        <img
          src={avatarUrl} // Отображаем avatarUrl
          alt="Аватар пользователя"
          className="user-photo"
        />
        <label htmlFor="avatar-upload" className="button-account">
          Изменить фото
        </label>
        <input
          type="file"
          id="avatar-upload"
          style={{ display: "none" }} // Скрываем input file
          onChange={handleAvatarChange} // Вызываем handleAvatarChange при выборе файла
          accept="image/*" // Принимаем только изображения
        />
      </div>
      <div className="user-info-details">
        <div className="info-row">
          <span className="info-label">ФИО:</span>
          <span className="info-background">Иванов Иван Иванович</span>
        </div>
        <div className="info-row">
          <span className="info-label">Группа:</span>
          <span className="info-background">АСОиУб-23-1</span>
        </div>
      </div>
      <div className="progress-container">
        <div className="progress-item">
          <span className="progress-title"></span>
        </div>
        <div className="progress-item">
          <span className="progress-title"></span>
        </div>
        <div className="progress-item">
          <span className="progress-title"></span>
        </div>
      </div>
    </div>
  );
}