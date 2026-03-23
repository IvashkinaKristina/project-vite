import "./Create.css";
import React, { useState, useRef } from "react";
import NavMenu from "../NavMenu/NavMenu";
import { useAuth } from '../../../src/context/AuthContext';
import { useNavigate } from "react-router-dom";
import { createLecture } from '../../../src/services/api';

export default function Create() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { time: "", text: "", answer: "", hint: "" },
    { time: "", text: "", answer: "", hint: "" },
    { time: "", text: "", answer: "", hint: "" }
  ]);

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

  const handleSave = async () => {
    if (!title || !file) {
      alert("Пожалуйста, укажите название лекции и выберите видео");
      return;
    }

    for (let q of questions) {
      if (!q.time || !q.text || !q.answer) {
        alert("Заполните все поля вопросов (время, вопрос, ответ)");
        return;
      }
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', file);
    const questionsForServer = questions.map(q => ({
      time: parseFloat(q.time),
      text: q.text,
      correctAnswer: q.answer,
      hint: q.hint,
      type: 'text-input'
    }));
    formData.append('questions', JSON.stringify(questionsForServer));

    try {
      await createLecture(formData);
      alert("Лекция успешно сохранена!");
      navigate("/lectures");
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <NavMenu />
      <div className="create-container">
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
            onClick={() => { if (!videoPreview) handleButtonClick(); }}
            style={{ cursor: videoPreview ? 'default' : 'pointer' }}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button className="ButtonNewQuestion" onClick={() => setShowForm(true)}>
            Добавить вопросы в лекцию
          </button>

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
                <h3 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#000000ff', textAlign: 'center' }}>
                  Форма создания вопросов
                </h3>

                <div style={{ overflowY: 'auto', flexGrow: 1, marginBottom: '20px', paddingRight: '10px' }}>
                  {questions.map((question, index) => (
                    <div key={index} style={{
                      marginBottom: '20px',
                      padding: '15px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ fontWeight: 'bold', color: '#463783' }}>Вопрос {index + 1}</div>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newQuestions = [...questions];
                              newQuestions.splice(index, 1);
                              setQuestions(newQuestions);
                            }}
                            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                          >
                            ×
                          </button>
                        )}
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <input
                          type="number"
                          step="0.1"
                          value={question.time}
                          placeholder="Время в секундах (например, 12.5)"
                          style={{ width: '100%', padding: '8px', border: '1px solid #463783', borderRadius: '4px' }}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].time = e.target.value;
                            setQuestions(newQuestions);
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <input
                          type="text"
                          value={question.text}
                          placeholder="Введите вопрос"
                          style={{ width: '100%', padding: '12px', border: '2px solid #463783', borderRadius: '6px' }}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].text = e.target.value;
                            setQuestions(newQuestions);
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#463783' }}>Ответ:</div>
                        <input
                          type="text"
                          value={question.answer}
                          placeholder="Введите правильный ответ"
                          style={{ width: '100%', padding: '8px', border: '1px solid #463783', borderRadius: '4px' }}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].answer = e.target.value;
                            setQuestions(newQuestions);
                          }}
                        />
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#463783' }}>Подсказка:</div>
                        <input
                          type="text"
                          value={question.hint}
                          placeholder="Введите подсказку"
                          style={{ width: '100%', padding: '8px', border: '1px solid #463783', borderRadius: '4px' }}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].hint = e.target.value;
                            setQuestions(newQuestions);
                          }}
                        />
                        <div style={{ fontSize: '12px', color: '#999' }}>Необязательное поле</div>
                      </div>
                    </div>
                  ))}
                </div>

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
                    fontWeight: 'bold'
                  }}
                  onClick={() => setQuestions([...questions, { time: "", text: "", answer: "", hint: "" }])}
                >
                  Добавить новый вопрос
                </button>

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
                    width: '100%'
                  }}
                  onClick={() => setShowForm(false)}
                >
                  Закрыть
                </button>
              </div>
            </>
          )}

          <button className="UploadButton" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}