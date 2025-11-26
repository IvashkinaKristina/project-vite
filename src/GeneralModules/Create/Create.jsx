import "./Create.css";
import React, { useState, useRef } from "react";
import NavMenu from "../NavMenu/NavMenu"; // Добавила меню

export default function Lectures() {
  const [file, setFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [showForm, setShowForm] = useState(false);

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

       <button 
          className="ButtonNewQuestion" 
          onClick={() => setShowForm(true)}
       >
          Добавить вопросы в лекцию
        </button>

            {/* Всплывающая форма */}
      {showForm && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999
            }} 
            onClick={() => setShowForm(false)}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            minWidth: '400px'
          }}>
            <h3 style={{margin: '0 0 20px 0', fontSize: '24px', color: '#333', textAlign: 'center'}}>
              Форма создания вопросов
            </h3>
            <form>
              <div style={{marginBottom: '20px'}}>
                <input 
                  type="text" 
                  placeholder="Введите данные..." 
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e1e1',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button 
                type="button" 
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  width: '100%'
                }}
                onClick={() => setShowForm(false)}
              >
                Закрыть
              </button>
            </form>
          </div>
        </>
      )}


        <button className="UploadButton" onClick={handleUpload}>
          Сохранить
        </button>
      </div>
    </div>
    </div>
  );
}

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
