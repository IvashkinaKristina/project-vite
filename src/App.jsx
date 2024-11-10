import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    
  };
  return (
    <>
    <div className='main-form'>
      <div className="header">
        <h1>ПЛАТФОРМА ИНТЕРАКТИВНЫХ ЛЕКЦИЙ ПО ДИСЦИПЛИНЕ</h1>
      </div>
      <div className="title">
        <h2>ДИСКРЕТНАЯ МАТЕМАТИКА</h2>
      </div>
      <div className="sub-forms">
        <div className="sub-form">
          <h3>Примеры применения дискретной математики в реальной жизни</h3>
        </div>
        <div className="sub-form">
          <h3>Материалы для самостоятельного изучения дискретной математики</h3>
        </div>
        <div className="sub-form">
          <h3>Безлимитный доступ к лекциям, статьям и методическим материалам</h3>
        </div>
        
      </div>
      <button className="auth-button">АВТОРИЗАЦИЯ</button>    
      
      </div>
      
      
     
    </>
  )
}

export default App
