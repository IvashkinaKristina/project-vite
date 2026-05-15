import React, { useState, useRef, useEffect } from "react";
import "./VideoSpace.css";
import { saveAnswer } from '../../services/api';

const VideoSpace = ({ videoUrl, questions, onBack, lectureId }) => {
  const videoRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [wasFullscreen, setWasFullscreen] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Функции полноэкранного режима
  const isFullscreen = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const enterFullscreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  // Отслеживание времени видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      questions.forEach((q) => {
        if (video.currentTime >= q.time &&
            !answeredQuestions.includes(q.time) &&
            currentQuestion?.time !== q.time) {
          if (isFullscreen()) {
            setWasFullscreen(true);
            exitFullscreen();
            setTimeout(() => {
              video.pause();
              setCurrentQuestion(q);
              setUserAnswer("");
              setSelectedOption(null);
              setWrongAttempts(0);
              setShowHint(false);
              setShowCorrect(false);
            }, 300);
          } else {
            video.pause();
            setCurrentQuestion(q);
            setUserAnswer("");
            setSelectedOption(null);
            setWrongAttempts(0);
            setShowHint(false);
            setShowCorrect(false);
            setWasFullscreen(false);
          }
        }
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [questions, answeredQuestions, currentQuestion]);

  const handleOptionSelect = (option) => setSelectedOption(option);

  const handleMultipleChoiceSubmit = async () => {
    if (selectedOption && currentQuestion) {
      if (selectedOption === currentQuestion.correctAnswer) {
        // Сохраняем ответ
        try {
          await saveAnswer({
            lecture_id: lectureId,
            question_time: currentQuestion.time,
            answer: selectedOption,
            correct: true,
            hint_used: showHint,
            attempts: wrongAttempts + 1
          });
        } catch (err) {
          console.error('Ошибка сохранения ответа:', err);
        }

        setShowCorrect(true);
        setTimeout(() => {
          setAnsweredQuestions(prev => [...prev, currentQuestion.time]);
          setCurrentQuestion(null);
          if (wasFullscreen && videoRef.current) {
            videoRef.current.play().catch(e => console.error(e));
            setTimeout(() => {
              enterFullscreen(videoRef.current);
              setWasFullscreen(false);
            }, 500);
          } else {
            videoRef.current?.play().catch(e => console.error(e));
          }
          setSelectedOption(null);
          setWrongAttempts(0);
          setShowHint(false);
          setShowCorrect(false);
        }, 1000);
      } else {
        const attempts = wrongAttempts + 1;
        setWrongAttempts(attempts);
        setSelectedOption(null);
        if (attempts >= 3) setShowHint(true);
      }
    }
  };

  const handleAnswerSubmit = async (e) => {
    if (e.key === 'Enter' && currentQuestion) {
      if (userAnswer.trim() === currentQuestion.correctAnswer) {
        // Сохраняем ответ
        try {
          await saveAnswer({
            lecture_id: lectureId,
            question_time: currentQuestion.time,
            answer: userAnswer.trim(),
            correct: true,
            hint_used: showHint,
            attempts: wrongAttempts + 1
          });
        } catch (err) {
          console.error('Ошибка сохранения ответа:', err);
        }

        setShowCorrect(true);
        setTimeout(() => {
          setAnsweredQuestions(prev => [...prev, currentQuestion.time]);
          setCurrentQuestion(null);
          if (wasFullscreen && videoRef.current) {
            videoRef.current.play().catch(e => console.error(e));
            setTimeout(() => {
              enterFullscreen(videoRef.current);
              setWasFullscreen(false);
            }, 500);
          } else {
            videoRef.current?.play().catch(e => console.error(e));
          }
          setUserAnswer("");
          setWrongAttempts(0);
          setShowHint(false);
          setShowCorrect(false);
        }, 1000);
      } else {
        const attempts = wrongAttempts + 1;
        setWrongAttempts(attempts);
        setUserAnswer("");
        e.target.placeholder = "Неверно! Попробуйте снова.";
        setTimeout(() => {
          e.target.placeholder = "Введите ваш ответ";
        }, 2000);
        if (attempts >= 3) setShowHint(true);
      }
    }
  };

  return (
    <div className="MainBody">
      <div className="Container-VideoSpace">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          style={{ width: '100%', maxWidth: '820px', height: 'auto' }}
        ></video>

        {currentQuestion && (
          <div className="question-modal">
            <div className="question-content">
              <div className="question-with-image">
                <p>{currentQuestion.text}</p>
                {currentQuestion.image && (
                  <img src={currentQuestion.image} className="matrix-image" alt="иллюстрация" />
                )}
              </div>

              {currentQuestion.type === "multiple-choice" && currentQuestion.options ? (
                <div className="options-container">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`option ${selectedOption === option ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                  <button
                    onClick={handleMultipleChoiceSubmit}
                    disabled={!selectedOption}
                    className="submit-option-btn"
                  >
                    Ответить
                  </button>
                </div>
              ) : (
                <div className="text-input-container">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={handleAnswerSubmit}
                    placeholder="Введите ваш ответ"
                    autoFocus
                    className="answer-input"
                  />
                  <p className="hint">Нажмите Enter чтобы продолжить</p>
                </div>
              )}

              {showCorrect && <div className="correct-message">Верно!</div>}

              {showHint && (
                <div className="hint-cloud">
                  <div className="cloud-content">
                    <div className="cloud-header"><h3>Подсказка</h3></div>
                    <div className="cloud-body"><p>{currentQuestion.hint}</p></div>
                    <div className="cloud-footer">
                      <button className="cloud-button" onClick={() => setShowHint(false)}>Понятно</button>
                    </div>
                  </div>
                  <div className="cloud-arrow"></div>
                </div>
              )}
            </div>
          </div>
        )}

        <button className="ButtonBack" onClick={onBack}>
          Вернуться к списку лекций
        </button>
      </div>
    </div>
  );
};

export default VideoSpace;