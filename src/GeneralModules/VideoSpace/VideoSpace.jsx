import "./VideoSpace.css";

const videoFile = "/videos/ЛЕКЦИЯ.mp4";

export default function VideoSpace({ onBack }) {
  return (
    <div className="MainBody">
      <div className="Container-VideoSpace">
        <div className="VideoSpace">
          <video src={videoFile} controls width={779} />
          <span id="notice">ЛЕКЦИЯ №1 «МНОЖЕСТВА»</span>
        </div>
        <button className="ButtonBack" onClick={onBack}>Вернуться к списку лекций</button>
      </div>
    </div>
  );
}
