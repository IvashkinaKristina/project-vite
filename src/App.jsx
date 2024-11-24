import { useState } from 'react'
import MainForm from './pages/Main/MainForm/MainForm'
import './App.css'



// Я бы тебе посоветовал переделать размерность из px в % для основных отоброжаемых контейнеров, так проще потом будет делать адаптивную верстку
// я потом свою размерность под твою подгоню, также измени название стилей элементов на более четкие, чтобы не путаться потом в них
// у меня посмотришь пример.
export default function App () {
  return (
    <>
    <main>

      <MainForm/>
    </main>
     
    </>
  )
}


