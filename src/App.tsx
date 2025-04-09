import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Excalidraw } from './excalidraw'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Excalidraw />
    </>
  )
}

export default App
