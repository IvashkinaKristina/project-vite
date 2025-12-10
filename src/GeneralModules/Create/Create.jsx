import "./Create.css";
import React, { useState, useRef } from "react";
import NavMenu from "../NavMenu/NavMenu"; // Добавила меню

export default function Lectures() {
  const [file, setFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState([
  {text: '', answer: '', hint: ''},
  {text: '', answer: '', hint: ''},
  {text: '', answer: '', hint: ''}
]); //это для вопросов в форме 

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
      minWidth: '400px',
      maxWidth: '500px',
      maxHeight: '80vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{
        margin: '0 0 20px 0', 
        fontSize: '24px', 
        color: '#000000ff', 
        textAlign: 'center',
        flexShrink: 0
      }}>
        Форма создания вопросов
      </h3>
      
      {/* Прокручиваемая область для вопросов */}
     <div style={{
  overflowY: 'auto',
  flexGrow: 1,
  marginBottom: '20px',
  paddingRight: '10px',
  scrollbarWidth: 'thin',
  scrollbarColor: '#ffffff #f5f5f5'
}}>
        
        <form>
          {questions.map((question, index) => (
            <div key={index} style={{
              marginBottom: '20px',
              position: 'relative',
              padding: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#463783'
                }}>
                  Вопрос {index + 1}
                </div>
                
                {/* Кнопка удаления вопроса */}
                {questions.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => {
                      const newQuestions = [...questions];
                      newQuestions.splice(index, 1);
                      setQuestions(newQuestions);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#000000ff',
                      cursor: 'pointer',
                      fontSize: '20px',
                      padding: '0',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ffeeee'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    title="Удалить вопрос"
                  >
                    ×
                  </button>
                )}
              </div>
              
              {/* Поле для вопроса */}
              <div style={{marginBottom: '12px'}}>
                <input 
                  type="text" 
                  value={question.text || ''}
                  placeholder="Введите вопрос" 
                  style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #463783',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  color: 'black',
                  backgroundColor: '#cac0f0ff'  
                  }}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index] = {
                      ...newQuestions[index],
                      text: e.target.value
                    };
                    setQuestions(newQuestions);
                  }}
                />
              </div>
              
              {/* Поле для ответа */}
              <div style={{marginBottom: '10px'}}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#463783',
                  marginBottom: '5px',
                  marginLeft: '5px'
                  
                }}>
                  Ответ:
                </div>
                <input 
                  type="text" 
                  value={question.answer || ''}
                  placeholder="Введите правильный ответ" 
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #463783',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#cac0f0ff',
                    color: 'black'
                    
                  }}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index] = {
                      ...newQuestions[index],
                      answer: e.target.value
                    };
                    setQuestions(newQuestions);
                  }}
                />
              </div>
              
              {/* Поле для подсказки */}
              <div style={{marginBottom: '5px'}}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#463783',
                  marginBottom: '5px',
                  marginLeft: '5px'
                }}>
                  Подсказка:
                </div>
                <input 
                  type="text" 
                  value={question.hint || ''}
                  placeholder="Введите подсказку для вопроса" 
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #463783',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#cac0f0ff',
                  }}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index] = {
                      ...newQuestions[index],
                      hint: e.target.value
                    };
                    setQuestions(newQuestions);
                  }}
                />
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginTop: '3px',
                  marginLeft: '5px',
                  fontStyle: 'italic'
                }}>
                  Необязательное поле
                </div>
              </div>
            </div>
          ))}
        </form>
      </div>
      
      {/* Кнопка добавления нового вопроса */}
      <button 
        type="button" 
        style={{
          padding: '10px 20px',
          border: '2px solid #463783',
          backgroundColor: 'transparent',
          color: '#463783',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          width: '100%',
          marginBottom: '15px',
          fontWeight: 'bold',
          flexShrink: 0
        }}
        onClick={() => setQuestions([...questions, {text: '', answer: '', hint: ''}])}
      >
        Добавить новый вопрос
      </button>
      
      {/* Кнопка закрытия */}
      <button 
        type="button" 
        style={{
          padding: '10px 20px',
          border: 'none',
          backgroundColor: '#463783',
          color: 'white',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          width: '100%',
          flexShrink: 0
        }}
        onClick={() => setShowForm(false)}
      >
        Закрыть
      </button>
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
