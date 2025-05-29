import "./Baze.css";
import MForm from "./MainForm/MainForm.jsx";
import Reg from "../Registration/Registration.jsx";
import SignUp from "../SignUp/SignUpForm.jsx"; // Добавляем импорт
import React, { useState } from "react";

export default function Main() {
  const [tab, setTab] = useState(null); // Инициализируем null, чтобы изначально ничего не показывать

  return (
    <div className="main-form">
      {tab !== "ShowReg" && tab !== "ShowSignUp" && ( // Условие: отображать MForm, пока tab НЕ равен "ShowReg"
        <MForm onChange={(current) => setTab(current)} />
      )}
      {tab === "ShowReg" && (
        <>
          <Reg />
        </>
      )}
      {tab === "ShowSignUp" && (
        <>
          <SignUp onReturn={() => setTab(null)} />
        </>
      )}
    </div>
  );
}
