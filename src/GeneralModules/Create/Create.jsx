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
            placeholder="Добавьте название лекции"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button className="ButtonNewQuestion" onClick={() => setShowForm(true)}>
            Добавить вопросы в лекцию
          </button>

          {showForm && (
            <>
              <div className="modal-overlay" onClick={() => setShowForm(false)} />
              <div className="modal-container">
                <h3>Форма создания вопросов</h3>
                <div className="questions-scroll">
                  {questions.map((question, index) => (
                    <div key={index} className="question-card">
                      <div className="question-header">
                        <span>Вопрос {index + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            className="delete-question-btn"
                            onClick={() => {
                              const newQuestions = [...questions];
                              newQuestions.splice(index, 1);
                              setQuestions(newQuestions);
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>

                      <div className="question-field">
                        <input
                          type="number"
                          step="0.1"
                          value={question.time}
                          placeholder="Время в секундах (например, 12.5)"
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].time = e.target.value;
                            setQuestions(newQuestions);
                          }}
                        />
                      </div>

                      <div className="question-field">
                        <input
                          type="text"
                          value={question.text}
                          placeholder="Введите вопрос"
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].text = e.target.value;
                            setQuestions(newQuestions);
                          }}
                        />
                      </div>

                      <div className="question-field">
                        <div className="sub-label">Ответ:</div>
                        <input
                          type="text"
                          value={question.answer}
                          placeholder="Введите правильный ответ"
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].answer = e.target.value;
                            setQuestions(newQuestions);
                          }}
                        />
                      </div>

                      <div>
                        <div className="sub-label">Подсказка:</div>
                        <input
                          type="text"
                          value={question.hint}
                          placeholder="Введите подсказку"
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].hint = e.target.value;
                            setQuestions(newQuestions);
                          }}
                        />
                        <div className="hint-note">Необязательное поле</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="add-question-btn"
                  onClick={() => setQuestions([...questions, { time: "", text: "", answer: "", hint: "" }])}
                >
                  Добавить новый вопрос
                </button>

                <button
                  type="button"
                  className="close-modal-btn"
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