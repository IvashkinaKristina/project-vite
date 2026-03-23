import React, { useState, useEffect } from 'react';
import './Lectures.css';
import VideoSpace from '../VideoSpace/VideoSpace';
import NavMenu from '../NavMenu/NavMenu';
import { getLectures } from '../../../src/services/api';
import { useAuth } from '../../../src/context/AuthContext';

export default function Lectures() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getLectures();
        setLectures(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLectures();
  }, []);

  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
  };

  return (
    <div>
      <NavMenu />
      <div className="ContainerForAll">
        <div className="ContentLectures">
          {!selectedLecture ? (
            lectures.length === 0 ? (
              <p>Нет доступных лекций</p>
            ) : (
              lectures.map((lecture) => (
                <button
                  key={lecture.id}
                  className="Content-button-Lectures"
                  onClick={() => handleLectureClick(lecture)}
                >
                  {lecture.title}
                </button>
              ))
            )
          ) : (
            <VideoSpace
              videoUrl={`http://localhost:5000${selectedLecture.video_url}`}
              questions={selectedLecture.questions}
              onBack={() => setSelectedLecture(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}