import React, { useState, useEffect } from 'react';
import './Lectures.css';
import VideoSpace from '../VideoSpace/VideoSpace';
import NavMenu from '../NavMenu/NavMenu';
import { getLectures, updateLecture } from '../../../src/services/api';
import { useAuth } from '../../../src/context/AuthContext';

export default function Lectures() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', questions: [] });
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getLectures();
        setLectures(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLectures();
  }, []);

  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
  };

  const handleEditClick = (lecture) => {
    setEditingLecture(lecture);
    setEditForm({
      title: lecture.title,
      questions: lecture.questions ? lecture.questions.map(q => ({
        time: q.time,
        text: q.text,
        answer: q.correctAnswer,
        hint: q.hint || ''
      })) : []
    });
    setEditVideoFile(null);
    setShowEditModal(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...editForm.questions];
    newQuestions[index][field] = value;
    setEditForm(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    setEditForm(prev => ({
      ...prev,
      questions: [...prev.questions, { time: '', text: '', answer: '', hint: '' }]
    }));
  };

  const removeQuestion = (index) => {
    const newQuestions = [...editForm.questions];
    newQuestions.splice(index, 1);
    setEditForm(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleSaveEdit = async () => {
    if (!editForm.title) {
      alert('Название лекции обязательно');
      return;
    }
    if (editForm.questions.some(q => !q.time || !q.text || !q.answer)) {
      alert('Заполните все поля вопросов (время, текст, ответ)');
      return;
    }

    const formData = new FormData();
    formData.append('title', editForm.title);
    if (editVideoFile) {
      formData.append('video', editVideoFile);
    }
    const questionsForServer = editForm.questions.map(q => ({
      time: parseFloat(q.time),
      text: q.text,
      correctAnswer: q.answer,
      hint: q.hint,
      type: 'text-input'
    }));
    formData.append('questions', JSON.stringify(questionsForServer));

    try {
      await updateLecture(editingLecture.id, formData);
      alert('Лекция обновлена');
      setShowEditModal(false);
      const data = await getLectures();
      setLectures(data);
    } catch (err) {
      alert('Ошибка обновления: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <NavMenu />
      <div className="ContainerForAll">
        <div className="ContentLectures">
          {!selectedLecture ? (
            lectures.length === 0 ? (
              <p>Нет доступных лекций</p>
            ) : (
              lectures.map((lecture) => (
                <div key={lecture.id} className="lecture-item">
                  <button
                    className="Content-button-Lectures"
                    onClick={() => handleLectureClick(lecture)}
                  >
                    {lecture.title}
                  </button>
                  {user?.role === 'teacher' && (
                    <button
                      className="edit-lecture-btn"
                      onClick={() => handleEditClick(lecture)}
                    >
                      Редактировать
                    </button>
                  )}
                </div>
              ))
            )
          ) : (
            <VideoSpace
              videoUrl={`http://localhost:5000${selectedLecture.video_url}`}
              questions={selectedLecture.questions}
              onBack={() => setSelectedLecture(null)}
              lectureId={selectedLecture.id}
            />
          )}
        </div>
      </div>

      {/* Модальное окно редактирования */}
      {showEditModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowEditModal(false)} />
          <div className="modal-container edit-modal">
            <h2>Редактирование лекции</h2>
            <input
              type="text"
              placeholder="Название лекции"
              value={editForm.title}
              onChange={(e) => handleEditFormChange('title', e.target.value)}
              className="edit-title-input"
            />
            <div className="edit-video-group">
              <label>Изменить видео (не нажимайте на кнопку, если не собираетесь менять видео)</label>
              <input type="file" accept="video/*" onChange={(e) => setEditVideoFile(e.target.files[0])} />
            </div>
            <h3>Вопросы</h3>
            <div className="questions-list">
              {editForm.questions.map((q, idx) => (
                <div key={idx} className="edit-question-card">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Время (сек)"
                    value={q.time}
                    onChange={(e) => handleQuestionChange(idx, 'time', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Текст вопроса"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Правильный ответ"
                    value={q.answer}
                    onChange={(e) => handleQuestionChange(idx, 'answer', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Подсказка (необязательно)"
                    value={q.hint}
                    onChange={(e) => handleQuestionChange(idx, 'hint', e.target.value)}
                  />
                  <button className="remove-question-btn" onClick={() => removeQuestion(idx)}>Удалить вопрос</button>
                </div>
              ))}
            </div>
            <button className="add-question-btn-edit" onClick={addQuestion}>+ Добавить вопрос</button>
            <div className="edit-actions">
              <button className="save-edit-btn" onClick={handleSaveEdit}>Сохранить изменения</button>
              <button className="cancel-edit-btn" onClick={() => setShowEditModal(false)}>Отмена</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}