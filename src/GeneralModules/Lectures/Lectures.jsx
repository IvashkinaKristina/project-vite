import "./Lectures.css";
import React, { useState } from "react";
import VideoSpace from "../VideoSpace/VideoSpace";

export default function Lectures() {
    const [activeLecture, setActiveLecture] = useState(null);

    const lectures = [
        {
            id: 1,
            title: "ЛЕКЦИЯ №1 «МНОЖЕСТВА»",
            component: <VideoSpace onBack={() => setActiveLecture(null)} />, // Передача onBack
        }
        
    ];


     const handleLectureClick = (lectureId) => {
       setActiveLecture(lectureId);
    };

   return (
    <div className="ContainerForAll">
      <div className="ContentLectures">
        {!activeLecture && (
          lectures.map((lecture) => (
            <button
              key={lecture.id}
              className="Content-button-Lectures"
              onClick={() => handleLectureClick(lecture.id)}
            >
              {lecture.title}
            </button>
          ))
        )}

        {activeLecture &&
          lectures.find((lecture) => lecture.id === activeLecture)?.component}
      </div>
    </div>
  );
}