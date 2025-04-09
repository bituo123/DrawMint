import { useState } from 'react'
import './App.css'
import { Excalidraw } from './excalidraw'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ height: "100vh",width: "100vw" }}>
      <Excalidraw
      />
    </div>
  )
}

export default App
