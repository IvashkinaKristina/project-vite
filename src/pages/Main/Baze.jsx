import "./Baze.css";
import MForm from "./MainForm/MainForm.jsx";
import Reg from "../Registration/Registration.jsx";
import React, { useState } from "react";

export default function Main() {
  const [tab, setTab] = useState(null); // Инициализируем null, чтобы изначально ничего не показывать

  return (
    <div className="main-form">
      {tab !== "ShowReg" && ( // Условие: отображать MForm, пока tab НЕ равен "ShowReg"
        <MForm onChange={(current) => setTab(current)} />
      )}
      {tab === "ShowReg" && (
        <>
          <Reg />
        </>
      )}
    </div>
  );
}
