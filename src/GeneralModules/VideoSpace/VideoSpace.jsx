import React, { useState, useRef, useEffect } from "react";
import "./VideoSpace.css";

const videoFile = "/videos/Матрицы.mp4";

// Добавляем конфигурацию вопросов с временными метками
const videoQuestions = [
  {
    time: 5, // на 5 секунде
    question: "Вопрос на 5 секунде: Чему равно 2 + 2?",
    correctAnswer: "4",
    image: null
  },
  {
    time: 8, // существующий вопрос
    question: "Вопрос: Вычислите определитель матрицы",
    correctAnswer: "-16",
    image: "/images/Матрица.jpg"
  },
  {
    time: 12, // на 12 секунде
    question: "Вопрос на 12 секунде: Сколько будет 3 × 7?",
    correctAnswer: "21",
    image: null
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
  const [currentQuestion, setCurrentQuestion] = useState(null); // Текущий активный вопрос
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // Отслеживаем отвеченные вопросы
  const [userAnswer, setUserAnswer] = useState('');
  const [testAnswers, setTestAnswers] = useState(Array(testQuestions.length).fill(null));
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState({ correct: 0, total: testQuestions.length });
 
  //КОД ДЛЯ ВСПЛЫВАЮЩЕЙ ПОДСКАЗКИ 
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  //КОНЕЦ КОДА ДЛЯ ВСПЛЫВАЮЩЕЙ ПОДСКАЗКИ

  // Обработчик времени видео
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      // Проверяем все вопросы из videoQuestions
      videoQuestions.forEach((q) => {
        // Если время подошло и вопрос еще не был показан и не отвечен
        if (video.currentTime >= q.time && 
            !answeredQuestions.includes(q.time) && 
            currentQuestion?.time !== q.time) {
          video.pause();
          setCurrentQuestion(q);
          setUserAnswer("");
          setWrongAttempts(0);
          setShowHint(false);
        }
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [currentQuestion, answeredQuestions]);

  const handleAnswerSubmit = (e) => {
    if (e.key === 'Enter' && currentQuestion) {
      if (userAnswer.trim() === currentQuestion.correctAnswer) {
        // Правильный ответ
        setAnsweredQuestions(prev => [...prev, currentQuestion.time]);
        setCurrentQuestion(null);
        videoRef.current.play().catch(e => console.error("Ошибка воспроизведения:", e));
        setUserAnswer("");
        setWrongAttempts(0);
        setShowHint(false);
      } else {
        // Неправильный ответ
        const attempts = wrongAttempts + 1;
        setWrongAttempts(attempts);
        setUserAnswer("");
        e.target.placeholder = "Неверно! Попробуйте снова.";
        setTimeout(() => {
          e.target.placeholder = "Введите ваш ответ";
        }, 2000);
        
        // Показываем подсказку после 3 неверных попыток
        if (attempts >= 3) {
          setShowHint(true);
        }
      }
    }
  };

  // Остальные функции остаются без изменений
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
          width={779}
        ></video>

        {/* Всплывающие вопросы */}
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

              {/* Подсказка */}
              {showHint && (
                <div className="hint-cloud">
                  <div className="cloud-content">
                    <div className="cloud-header">
                      <h3>Подсказка</h3>
                    </div>
                    <div className="cloud-body">
                      <p>Для матрицы 2x2: det = a*d - b*c</p>
                      <p>Где a, b – элементы первой строки</p>
                      <p>c, d – элементы второй строки</p>
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

        {/* Блок с тестом (закомментирован) */}
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