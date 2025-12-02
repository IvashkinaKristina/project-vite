import React, { useState, useRef, useEffect } from "react";
import "./VideoSpace.css";

const videoFile = "/videos/Лекция1.mp4";

// Заменяем конфигурацию вопросов на новую (с типами: multiple-choice и text-input)
const videoQuestions = [
  {
    time: 7,
    question: "Вопрос 1: Прямоугольная таблица, образованная из элементов некоторого множества и состоящая из m строк и n столбцов - это",
    type: "multiple-choice",
    options: [
      "Матрица",
      "Вектор",
      "Функция"
    ],
    correctAnswer: "Матрица",
    image: null,
    hint: "Вспомните основное определение из начала лекции"
  },
  {
    time: 34, 
    question: "Определите, к какому из изученных видов относится матрица, изображённая ниже",
    type: "multiple-choice",
    options: [
      "Диагональная",
      "Единичная",
      "Треугольная"
    ],
    correctAnswer: "Диагональная",
    image: "/images/вопрос 2 всплывающего окна.png",
    hint: "Посмотрите на расположение ненулевых элементов"
  },
  {
    time: 48,
    question: "Как называется матрица, все элементы которой равны нулю, и как она обозначается? (ответ вписывайте с большой буквы)",
    type: "text-input",
    correctAnswer: "Нулевая О",
    image: null,
    hint: "В математике её называют 'абсолютным нулём' — она не меняет другие матрицы при сложении"
  }
];

const testQuestions = [
  {
    question: "1. Что такое бином Ньютона?",
    options: [
      "Формула для разложения тригонометрических функций",
      "Формула для разложения выражений вида (a + b) в n-ую сумму членов",
      "Формула для нахождения площади круга"
    ],
    correctAnswer: 1
  },
  {
    question: "2. Чему равен коэффициент при x^0 в разложении (x + 1)?",
    options: ["5", "10", "1"],
    correctAnswer: 2
  },
  {
    question: "3. Сумма биномиальных коэффициентов в разложении (a + b)^n равна:",
    options: ["8", "16", "32"],
    correctAnswer: 2
  }
];

const VideoSpace = ({ onBack }) => {
  const videoRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [testAnswers, setTestAnswers] = useState(Array(testQuestions.length).fill(null));
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState({ correct: 0, total: testQuestions.length });
  const [wasFullscreen, setWasFullscreen] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  // ДОБАВЛЕНО: состояние для выбранного варианта
  const [selectedOption, setSelectedOption] = useState(null);

  // Функции для полноэкранного режима (остаются без изменений)
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

  // Обработчик времени видео
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      videoQuestions.forEach((q) => {
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
              setSelectedOption(null); // ДОБАВЛЕНО: сбрасываем выбранный вариант
              setWrongAttempts(0);
              setShowHint(false);
              setShowCorrect(false);
            }, 300);
          } else {
            video.pause();
            setCurrentQuestion(q);
            setUserAnswer("");
            setSelectedOption(null); // ДОБАВЛЕНО: сбрасываем выбранный вариант
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
  }, [currentQuestion, answeredQuestions]);

  // ДОБАВЛЕНО: обработчик выбора варианта для multiple-choice
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // ДОБАВЛЕНО: обработчик отправки ответа для вариантов с выбором
  const handleMultipleChoiceSubmit = () => {
    if (selectedOption && currentQuestion) {
      if (selectedOption === currentQuestion.correctAnswer) {
        setShowCorrect(true);
        setTimeout(() => {
          setAnsweredQuestions(prev => [...prev, currentQuestion.time]);
          setCurrentQuestion(null);
          if (wasFullscreen && videoRef.current) {
            videoRef.current.play().catch(e => console.error("Ошибка воспроизведения:", e));
            setTimeout(() => {
              enterFullscreen(videoRef.current);
              setWasFullscreen(false);
            }, 500);
          } else {
            videoRef.current.play().catch(e => console.error("Ошибка воспроизведения:", e));
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
        
        if (attempts >= 3) {
          setShowHint(true);
        }
      }
    }
  };

  // Существующая функция для текстовых ответов (немного модифицирована)
  const handleAnswerSubmit = (e) => {
    if (e.key === 'Enter' && currentQuestion) {
      if (userAnswer.trim() === currentQuestion.correctAnswer) {
        setShowCorrect(true);
        setTimeout(() => {
          setAnsweredQuestions(prev => [...prev, currentQuestion.time]);
          setCurrentQuestion(null);
          if (wasFullscreen && videoRef.current) {
            videoRef.current.play().catch(e => console.error("Ошибка воспроизведения:", e));
            setTimeout(() => {
              enterFullscreen(videoRef.current);
              setWasFullscreen(false);
            }, 500);
          } else {
            videoRef.current.play().catch(e => console.error("Ошибка воспроизведения:", e));
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
        
        if (attempts >= 3) {
          setShowHint(true);
        }
      }
    }
  };

  // Остальные функции без изменений
  const handleAnswerSelect = (questionIndex, selectedOption) => {
    const newAnswers = [...testAnswers];
    newAnswers[questionIndex] = selectedOption;
    setTestAnswers(newAnswers);
  };

  const handleSubmitTest = () => {
    let correctAnswers = 0;
    for (let i = 0; i < testQuestions.length; i++) {
      if (testAnswers[i] === testQuestions[i].correctAnswer) {
        correctAnswers++;
      }
    }
    setTestResults({ correct: correctAnswers, total: testQuestions.length });
    setTestCompleted(true);
  };

  return (
    <div className="MainBody">
      <div className="Container-VideoSpace">
        <video 
          ref={videoRef}
          src={videoFile}
          controls
          width={820}
        ></video>

        {currentQuestion && (
          <div className="question-modal">
            <div className="question-content">
              <div className="question-with-image">
                <p>{currentQuestion.question}</p>
                {currentQuestion.image && (
                  <img 
                    src={currentQuestion.image} 
                    className="matrix-image"
                  />
                )}
              </div>
              
              {/* ДОБАВЛЕНО: блок выбора вариантов для multiple-choice */}
              {currentQuestion.type === "multiple-choice" && (
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
              )}

              {/* Существующий блок для text-input */}
              {(currentQuestion.type === "text-input" || !currentQuestion.type) && (
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

              {showCorrect && (
                <div className="correct-message">
                  Верно!
                </div>
              )}

              {showHint && (
                <div className="hint-cloud">
                  <div className="cloud-content">
                    <div className="cloud-header">
                      <h3>Подсказка</h3>
                    </div>
                    <div className="cloud-body">
                      <p>{currentQuestion.hint}</p>
                    </div>
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

        {/*
        <div className="test-container">
          <h2>Тест</h2>
          {testQuestions.map((question, index) => (
            <div key={index} className="question-container">
              <p>{question.question}</p>
              <div className="options-wrapper">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-container">
                    <input
                      type="radio"
                      id={`question${index}.option${optionIndex}`}
                      name={`question${index}`}
                      value={optionIndex}
                      checked={testAnswers[index] === optionIndex}
                      onChange={() => handleAnswerSelect(index, optionIndex)}
                    />
                    <label htmlFor={`question${index}.option${optionIndex}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmitTest}>Завершить тест</button>
        </div>
        */}

        <button className="ButtonBack" onClick={onBack}>
          Вернуться к списку лекций
        </button>
      </div>
    </div>
  );
};

export default VideoSpace;