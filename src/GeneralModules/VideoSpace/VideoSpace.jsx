import React, { useState } from "react";
import "./VideoSpace.css";

const videoFile = "/videos/ЛЕКЦИЯ.mp4";

const testQuestions = [
  {
    question: "1. Что такое бином Ньютона?",
    options: [
      "Формула для разложения тригонометрических функций",
      "Формула для разложения выражений вида (a + b) в n-ую сумму членов",
      "Формула для нахождения площади круга",
    ],
    correctAnswer: 1,
  },
  {
    question: "2. Чему равен коэффициент при x² в разложении (x + 1)⁷?",
    options: ["5", "10", "1"],
    correctAnswer: 2,
  },
  {
    question: "3. Сумма биномиальных коэффициентов в разложении (a + b)ⁿ равна:",
    options: ["8", "16", "32"],
    correctAnswer: 2,
  },
];

export default function VideoSpace({ onBack }) {
  const [testAnswers, setTestAnswers] = useState(Array(testQuestions.length).fill(null));
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState({ correct: 0, total: testQuestions.length });

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
        <video src={videoFile} controls width={779}></video>
        <span id="notice">
          ЛЕКЦИЯ #1 БИНОМ НЬЮТОНА
        </span>

        {/* Тест */}
        {!testCompleted && (
          <div className="test-container">
            <h2>Тест</h2>
            {testQuestions.map((question, index) => (
              <div key={index} className="question-container">
                <p>{question.question}</p>
                <div className="options-wrapper"> {/*  для стилей */}
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-container">
                      <input
                        type="radio"
                        id={`question${index}-option${optionIndex}`} // Уникальные id
                        name={`question${index}`} // Группировка по вопросам
                        value={optionIndex}
                        checked={testAnswers[index] === optionIndex}
                        onChange={() => handleAnswerSelect(index, optionIndex)}
                      />
                      <label htmlFor={`question${index}-option${optionIndex}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleSubmitTest}>Завершить тест</button>
          </div>
        )}

        {/* Отображение результатов */}
        {testCompleted && (
          <div className="test-results">
            <p>
              Результаты теста: {testResults.correct} из {testResults.total}
                {(() => {
                    if (testResults.correct === 1) {
                        return " правильный ответ";
                    } else if (testResults.correct > 1 && testResults.correct < 5) {
                        return " правильных ответа";
                    } else {
                        return " правильных ответов";
                    }
                })()}
            </p>
          </div>
        )}
        <button className="ButtonBack" onClick={onBack}>Вернуться к списку лекций</button>
      </div>
        </div>
  );
}