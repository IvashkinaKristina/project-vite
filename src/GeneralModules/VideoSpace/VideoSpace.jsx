import "./VideoSpace.css";
import Menu from "../../GeneralModules/Menu/Menu";
const videoFile = '/videos/ЛЕКЦИЯ.mp4';


export default function VideoSpace() {
  return (
    <div className="ContainerForAll">
      <Menu />
      <div className="Container-VideoSpace">
        <div className="VideoSpace">
            <video src={videoFile} controls width={779} />
          <span id="notice"></span>
        </div>
      </div>
    </div>
  );
}


