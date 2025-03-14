import "./VideoSpace.css";

const videoFile = "/videos/ЛЕКЦИЯ.mp4";

export default function VideoSpace({ onBack }) {
  return (
    <div className="MainBody">
      <div className="Container-VideoSpace">
        <div className="VideoSpace">
          <video src={videoFile} controls width={779} />
          <span id="notice">ЛЕКЦИЯ №1 «БИНОМ НЬЮТОНА»</span>
        </div>
        <div id="test">
          <div className="question">
            <p className="question-text">Что такое бином Ньютона?</p>
            <div className="options-wrapper">
              <label className="option-label" htmlFor="q1_option1">
                <input type="radio" name="question1" id="q1_option1" value="a" />
                Формула для разложения тригонометрических функций
              </label>
              <label className="option-label" htmlFor="q1_option2">
                <input type="radio" name="question1" id="q1_option2" value="b" />
                Формула для разложения выражения вида (a + b)ⁿ в сумму членов
              </label>
              <label className="option-label" htmlFor="q1_option3">
                <input type="radio" name="question1" id="q1_option3" value="c" />
                Формула для нахождения площади круга
              </label>
            </div>
          </div>

          <div className="question">
            <p className="question-text">Чему равен коэффициент при x² в разложении (x + 1)⁵ ?</p>
            <div className="options-wrapper">
              <label className="option-label" htmlFor="q2_option1">
                <input type="radio" name="question2" id="q2_option1" value="5" />
                5
              </label>
              <label className="option-label" htmlFor="q2_option2">
                <input type="radio" name="question2" id="q2_option2" value="10" />
                10
              </label>
              <label className="option-label" htmlFor="q2_option3">
                <input type="radio" name="question2" id="q2_option3" value="1" />
                1
              </label>
            </div>
          </div>
          <div className="question">
            <p className="question-text">Сумма биномиальных коэффициентов в разложении (a + b)⁴ равна:</p>
            <div className="options-wrapper">
              <label className="option-label" htmlFor="q3_option1">
                <input type="radio" name="question3" id="q3_option1" value="8" />
                8
              </label>
              <label className="option-label" htmlFor="q3_option2">
                <input type="radio" name="question3" id="q3_option2" value="16" />
                16
              </label>
              <label className="option-label" htmlFor="q3_option3">
                <input type="radio" name="question3" id="q3_option3" value="32" />
                32
              </label>
            </div>
          </div>
        </div>
        <button className="ButtonBack" onClick={onBack}>Вернуться к списку лекций</button>
      </div>
    </div>
  );
}
