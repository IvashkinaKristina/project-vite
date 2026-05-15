import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../src/context/AuthContext';
import { getLectures, getStatistics } from '../../../src/services/api';
import NavMenu from '../NavMenu/NavMenu';
import './Statistics.css';

export default function Statistics() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [selectedLectureId, setSelectedLectureId] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'teacher') {
      getLectures().then(setLectures).catch(console.error);
    }
  }, [user]);

  const handleLectureChange = async (e) => {
    const id = e.target.value;
    setSelectedLectureId(id);
    if (id) {
      setLoading(true);
      try {
        const data = await getStatistics(id);
        setStats(data);
      } catch (err) {
        console.error(err);
        alert('Ошибка загрузки статистики');
      } finally {
        setLoading(false);
      }
    } else {
      setStats(null);
    }
  };

  if (!user || user.role !== 'teacher') {
    return <div>Доступ только для преподавателей</div>;
  }

  return (
    <div>
      <NavMenu />
      <div className="statistics-container">
        <h2>Статистика по лекциям</h2>
        <select value={selectedLectureId} onChange={handleLectureChange}>
          <option value="">Выберите лекцию</option>
          {lectures.map(l => (
            <option key={l.id} value={l.id}>{l.title}</option>
          ))}
        </select>

        {loading && <p>Загрузка...</p>}

        {stats && (
          <div className="stats-table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Студент</th>
                  {stats.questions.map((q, idx) => (
                    <th key={idx} title={`Время: ${q.time} сек`}>
                      Вопрос {idx+1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.students.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    {student.answers.map((ans, idx) => (
                      <td key={idx}>
                        <span className={ans.answered ? (ans.hintUsed ? 'red-indicator' : 'green-indicator') : 'gray-indicator'} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="legend">
              <span className="green-indicator"></span> Ответил без подсказки
              <span className="red-indicator"></span> Ответил с подсказкой
            </div>
          </div>
        )}
      </div>
    </div>
  );
}