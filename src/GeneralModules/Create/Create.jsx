import "./Create.css";
import React, { useState, useRef } from "react";
import NavMenu from "../NavMenu/NavMenu"; // Добавила меню

export default function Lectures() {
  const [file, setFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      previewVideo(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      previewVideo(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const previewVideo = (file) => {
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
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
  
  return (
    // Добавила меню
    <div><NavMenu />
    <div className="create-container">
      {/*<h2 className="Heading">РЕДАКТОР ЛЕКЦИЙ</h2>*/}
      <div className="SpaceForCreate">
        
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      <div
          className="video-drop-area"
          ref={dropAreaRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={(e) => {
            // не кликается, если видео уже загружено
            if (!videoPreview) {
              handleButtonClick();
            }
          }}
          style={{ cursor: videoPreview ? 'default' : 'pointer' }} // Меняется курсор
        >
          {videoPreview ? (
            <video controls className="video-preview">
              <source src={videoPreview} type={file.type} />
              Ваш браузер не поддерживает видео
            </video>
          ) : (
            <p>Добавьте видео</p>
          )}
        </div>

        <input
          className="InputCreate"
          type="text"
          placeholder="Добавить название лекции"
          id="1"
        />

       <button className="ButtonNewQuestion">
          Добавить вопросы в лекцию
        </button>

 {/*<div className="button-container">
         <button className="icon-button" onClick={handleButtonClick}>
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
        </div> */}

        <button className="UploadButton" onClick={handleUpload}>
          Сохранить
        </button>
      </div>
    </div>
    </div>
  );
}
