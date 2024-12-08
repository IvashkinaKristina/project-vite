import "./VideoSpace.css";
import Menu from "../../GeneralModules/Menu/Menu";

export default function VideoSpace() {
  return (
    <div className="containerForAll">
        <Menu />
        <div className="Container-VideoSpace">
          <div className="VideoSpace">
            <span id="notice">Тут должен быть плеер</span>
          </div>
        </div>
    </div>
  );
}
