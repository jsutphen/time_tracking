import { useState } from 'react'
import './App.css'

function App() {

  const [started, setStarted] = useState(false);

  return (
    <div className='w-full items-center flex justify-between'>
      <p className=''>03:24</p>
      <button onClick={() => setStarted(!started)}>{started ? 'Stop' : 'Start'}</button>
    </div>
  )
}

export default App
