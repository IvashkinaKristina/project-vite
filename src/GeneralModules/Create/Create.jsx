import "./Create.css";
import React, { useState } from "react";



const FileUploader = () => {
  const [file, setFile] = useState(null);
};
const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);
};

const handleUpload = async () => {
  if (!file) {
    alert("Пожалуйста, выберите файл");
    return;
  }

  const formData = new FormData();
  formData.append("video", file);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Файл успешно загружен");
    } else {
      alert("Ошибка при загрузке файла");
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

export default function Lectures() {
  return (
    <div className="create-container">
      <h2 className="Heading">РЕДАКТОР ЛЕКЦИЙ</h2>
      <div className="SpaceForCreate">
        
        <input
          className="Upload"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
        />
        <input
          className="InputCreate"
          type="text"
          placeholder="Добавить название лекции"
          id="1"
        />
        <input
          className="InputCreate"
          type="text"
          placeholder="Добавить краткое описание лекции"
          id="2"
        />

<div className="button-container">
          <button className="icon-button">
            <img src="/images/Upload.png" alt="Upload" />
          </button>
          <button className="icon-button">
            <img src="/images/Cut.png" alt="Cut" />
          </button>
          <button className="icon-button">
          <img src="/images/Plus.png" alt="Plus" />
          </button>
          <button className="icon-button">
            <img src="/images/Save.png" alt="Save" />
          </button>
          <button className="icon-button">
            <img src="/images/Settings.png" alt="Settings" />
          </button>
        </div>

        <button className="UploadButton" onClick={handleUpload}>
          Сохранить
        </button>
      </div>
    </div>
  );
}
