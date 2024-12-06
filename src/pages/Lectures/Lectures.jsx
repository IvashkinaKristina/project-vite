import "./Lectures.css";
import Menu from "../../GeneralModules/Menu/Menu";

export default function Lectures() {
  return (
    <div class="ContainerForAll">
      <Menu/>
      <div class="ContentLectures">
        <button class="Content-button-Lectures">ЛЕКЦИЯ №1 «МНОЖЕСТВА»</button>
        <button class="Content-button-Lectures">
          ЛЕКЦИЯ №2 «ДЕЙСТВИЯ С МНОЖЕСТВАМИ»
        </button>
        <button class="Content-button-Lectures">ЛЕКЦИЯ №3 «ГРАФЫ»</button>
      </div>
    </div>
  );
}
