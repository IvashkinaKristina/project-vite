import React, { useState, useRef, useEffect } from "react";
import "./VideoSpace.css";

const videoFile = "/videos/ЛЕКЦИЯ.mp4";

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
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionShown, setQuestionShown] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [testAnswers, setTestAnswers] = useState(Array(testQuestions.length).fill(null));
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState({ correct: 0, total: testQuestions.length });

  // Обработчик времени видео
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      // Показываем вопрос только если:
      // 1. Время >= 3:57 (237 сек)
      // 2. Окно ещё не показано (showQuestion = false)
      // 3. Вопрос ещё ни разу не был показан (questionShown = false)
      if (video.currentTime >= 237 && !showQuestion && !questionShown) {
        video.pause();
        setShowQuestion(true);
        setQuestionShown(true); // Помечаем вопрос как показанный
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [showQuestion]);

  const handleAnswerSubmit = (e) => {
    if (e.key === 'Enter') {
      setShowQuestion(false);
      videoRef.current.play();
      setUserAnswer("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowQuestion(false);
      videoRef.current.play()
        .catch(e => console.error("Ошибка воспроизведения:", e));
      setUserAnswer('');
    }
  };
  // Выбор ответа в тесте
  const handleAnswerSelect = (questionIndex, selectedOption) => {
    const newAnswers = [...testAnswers];
    newAnswers[questionIndex] = selectedOption;
    setTestAnswers(newAnswers);
  };

  // Отправка теста
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

        {/* Вопрос в 3:57 */}
        {showQuestion && (
          <div className="question-modal">
            <div className="question-content">
              <p>Вопрос: Сколько членов в разложении (x + y)^3?</p>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => { // Вот это критически важно!
                if (e.key === 'Enter') {
                  if (userAnswer.trim() === "4") {
                    setShowQuestion(false);
                    videoRef.current.play()
                    .catch(e => console.error("Ошибка воспроизведения:", e));
              setUserAnswer("");
                  } else{
                    setUserAnswer("");
                    e.target.placeholder = "Неверно! Попробуйте снова.";
                    setTimeout(() => {
                    e.target.placeholder = "Введите ваш ответ."
                    }, 2000);
                }
          }
        }}
                placeholder="Введите ваш ответ..."
                autoFocus
                className="answer-input"
              />
              <p className="hint">Нажмите Enter чтобы продолжить</p>
            </div>
          </div>
        )}

        {/* Блок с тестом */}
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

        {/* Результаты теста */}
        {testCompleted && (
          <div className="test-results">
            <p>
              Результаты теста: {testResults.correct} из {testResults.total}
              {(() => {
                if (testResults.correct === 1) return " правильный ответ";
                if (testResults.correct > 1 && testResults.correct < 5) return " правильных ответа";
                return " правильных ответов";
              })()}
            </p>
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