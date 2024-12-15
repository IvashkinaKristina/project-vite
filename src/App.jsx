import MainForm from "./pages/Main/Baze.jsx";
import "./App.css";
import VideoSpace from "./GeneralModules/VideoSpace/VideoSpace.jsx";
import Lectures from "./pages/Lectures/Lectures.jsx";
import PersonalAccount from "./pages/PersonalAccount/PersonalAccount.jsx"


// Я бы тебе посоветовал переделать размерность из px в % для основных отоброжаемых контейнеров, так проще потом будет делать адаптивную верстку
// я потом свою размерность под твою подгоню, также измени название стилей элементов на более четкие, чтобы не путаться потом в них
// у меня посмотришь пример.
//проверка
export default function App() {
  return (
    <>
      <main>
        {/* <MainForm/> */}
        {/* <Lectures/> */}
        {/* <VideoSpace/> */}
        <PersonalAccount/>
      </main>
    </>
  );
}
